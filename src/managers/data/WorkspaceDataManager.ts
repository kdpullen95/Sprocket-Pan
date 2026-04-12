import type {
	Endpoint,
	EndpointRequest,
	Service,
	WorkspaceData,
	WorkspaceItems,
	WorkspaceMetadata,
	WorkspaceSyncedData,
} from '@/types/data/workspace';
import { nullifyProperties } from '@/utils/functions';
import { extractProperty } from '@/utils/getters';
import { log } from '@/utils/logging';
import { mergeDeep } from '@/utils/variables';
import { path } from '@tauri-apps/api';
import { save } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { FileSystemManager } from '../file-system/FileSystemManager';
import { FileSystemWorker } from '../file-system/FileSystemWorker';
import type { InvokerFileUpdate } from '../RustInvoker';
import { SaveUpdateManager } from '../SaveUpdateManager';

export const defaultWorkspaceSyncedData: WorkspaceSyncedData = {
	services: {},
	endpoints: {},
	requests: {},
	environments: {},
	scripts: {},
	secrets: [],
};

export const defaultWorkspaceData: WorkspaceData = {
	...defaultWorkspaceSyncedData,
	history: {},
	selectedEnvironment: undefined,
	uiMetadata: {
		idSpecific: {},
	},
	settings: {},
	version: SaveUpdateManager.getCurrentVersion(),
	syncMetadata: { items: {} },
	selectedServiceEnvironments: {},
};

export interface OrphanData {
	endpoints: { orphan: Endpoint; parent?: string }[];
	requests: { orphan: EndpointRequest; parent?: string; grandparent?: string }[];
	ancestors: Record<string, Service | Endpoint>;
}

type Parser = (content: string) => Promise<Partial<WorkspaceData>> | Partial<WorkspaceData>;

async function parseFile(url: string, parse: Parser): Promise<Partial<WorkspaceData>> {
	const content = await FileSystemWorker.readTextFile(url);
	const data = await parse(content);
	SaveUpdateManager.update(data);
	return data;
}

function loadSprocketFile(url: string) {
	return parseFile(url, (content) => JSON.parse(content));
}

async function exportData(data: WorkspaceData, metadata: WorkspaceMetadata) {
	const filePath = await save({
		title: `Save ${metadata.name} Workspace`,
		filters: [
			{ name: 'Sprocketpan Workspace', extensions: ['json'] },
			{ name: 'All Files', extensions: ['*'] },
		],
	});

	if (!filePath) {
		return;
	}

	const dataToWrite = JSON.stringify(
		{ ...data, secrets: data.secrets.map(({ key }) => ({ key, value: '' })) },
		nullifyProperties<WorkspaceData & EndpointRequest>('history', 'settings', 'uiMetadata'),
	);

	await writeTextFile(filePath, dataToWrite);
}

async function saveData(allData: WorkspaceData, { fileName, ...metadata }: WorkspaceMetadata) {
	const { data, sync, location } = splitWorkspace(allData);
	const { uiMetadata, secrets, history, ...strippedData } = structuredClone(data);

	const paths = getWorkspacePath(fileName);
	const processedHistory = processHistoryForSave(history);
	const filesToWrite: InvokerFileUpdate[] = [
		{ path: paths.data, content: JSON.stringify(strippedData) },
		{ path: paths.history, content: JSON.stringify(processedHistory) },
		{ path: paths.metadata, content: JSON.stringify({ ...metadata, lastModified: new Date().getTime() }) },
		{ path: paths.uiMetadata, content: JSON.stringify(uiMetadata) },
		{ path: paths.secrets, content: JSON.stringify(secrets) },
	];

	if (location != null) {
		const syncContent = JSON.stringify(sync);
		filesToWrite.push({ path: location, content: syncContent, absolute: true });
		filesToWrite.push({ path: paths.syncBackup, content: syncContent });
	}
	await FileSystemWorker.writeFiles(filesToWrite);
}

function processHistoryForSave(history: WorkspaceData['history']) {
	for (const key in history) {
		history[key] = history[key].filter((res) => !res.discard);
		// cleanliness
		if (history[key].length === 0) {
			delete history[key];
		}
	}
	return history;
}

function findOrphans(data: WorkspaceData) {
	return {
		endpoints: Object.values(data.endpoints).filter((endpoint) => data.services[endpoint.serviceId] == null),
		requests: Object.values(data.requests).filter((request) => data.endpoints[request.endpointId] == null),
	};
}

async function processOrphans(data: WorkspaceData, metadata: WorkspaceMetadata): Promise<OrphanData> {
	const list = findOrphans(data);
	const orphan: OrphanData = {
		endpoints: list.endpoints.map((orphan) => ({ orphan })),
		requests: list.requests.map((orphan) => ({ orphan })),
		ancestors: {},
	};
	const paths = getWorkspacePath(metadata.fileName);
	if (getSyncLocation(data) != null && (await FileSystemWorker.exists(paths.syncBackup))) {
		const backup = JSON.parse(await FileSystemWorker.readTextFile(paths.syncBackup)) as WorkspaceSyncedData;
		orphan.endpoints.forEach((endpoint) => {
			const service = backup.services[endpoint.orphan.serviceId];
			if (service != null) {
				endpoint.parent = service.id;
				orphan.ancestors[service.id] = service;
			}
		});
		orphan.requests.forEach((request) => {
			const endpoint = backup.endpoints[request.orphan.endpointId];
			if (endpoint != null) {
				request.parent = endpoint.id;
				request.grandparent = endpoint.serviceId;
				orphan.ancestors[endpoint.id] = endpoint;
				const service = backup.services[endpoint.serviceId];
				if (service != null) {
					orphan.ancestors[service.id] = service;
				}
			}
		});
	}
	return orphan;
}

function getWorkspacePath(folder: string) {
	if (folder == null) {
		throw new Error('workspace folder path must be provided');
	}
	const root = `${FileSystemWorker.DATA_FOLDER_NAME}${path.sep()}${folder}`;
	const base = `${root}${path.sep()}${FileSystemWorker.DATA_FILE_NAME}`;
	return {
		root,
		data: `${base}.json`,
		history: `${base}_history.json`,
		metadata: `${base}_metadata.json`,
		uiMetadata: `${base}_ui_metadata.json`,
		secrets: `${base}_secrets.json`,
		syncBackup: `${base}_sync_backup.json`,
	};
}

async function initializeWorkspace(workspace: WorkspaceMetadata) {
	await FileSystemManager.createDataFolderIfNotExists();
	await createDataFilesIfNotExist(workspace);
	return await loadDataFromFile(workspace);
}

async function loadDataFromFile(workspace: WorkspaceMetadata) {
	const paths = getWorkspacePath(workspace.fileName);
	const [data, history, uiMetadata, secrets] = await Promise.all([
		FileSystemWorker.readTextFile(paths.data),
		FileSystemWorker.readTextFile(paths.history),
		FileSystemWorker.readTextFile(paths.uiMetadata),
		FileSystemWorker.readTextFile(paths.secrets),
	]);
	let parsedData = JSON.parse(data) as WorkspaceData;
	parsedData.history = JSON.parse(history);
	parsedData.uiMetadata = JSON.parse(uiMetadata);
	parsedData.secrets = JSON.parse(secrets);
	const syncLocation = getSyncLocation(parsedData);
	if (syncLocation != null) {
		const parsedSync = JSON.parse(await FileSystemWorker.readTextFile(syncLocation)) as WorkspaceItems;
		parsedData = mergeDeep(parsedData, parsedSync, undefined, 1);
	}
	SaveUpdateManager.update(parsedData);
	return parsedData;
}

function splitWorkspace(data: WorkspaceData) {
	const location = getSyncLocation(data);
	if (location == null) {
		return { data };
	}
	const retData: WorkspaceData = structuredClone(data);
	const syncData: WorkspaceSyncedData = structuredClone(defaultWorkspaceSyncedData);
	Object.entries(data.syncMetadata.items).forEach(([id, value]) => {
		if (value) {
			const key = extractProperty(id);
			if (key == null || key == 'workspaces') {
				delete retData.syncMetadata.items[id];
				return;
			}
			delete retData[key][id];
			syncData[key][id] = data[key][id];
		}
	});
	return { data: retData, sync: syncData, location };
}

function getSyncLocation(data: WorkspaceData) {
	const sync = data.settings.data?.sync;
	return sync?.enabled && sync?.location != null && sync.location !== ''
		? `${sync.location}${path.sep()}data_sync.json`
		: null;
}

/**
 * This function creates the data folder and workspace data files if they do not already exist.
 * @returns true if it created at least one file or folder, false if not.
 */
async function createDataFilesIfNotExist({ fileName, ...workspace }: WorkspaceMetadata) {
	log.trace(`createDataFilesIfNotExist called`);
	const { uiMetadata, ...defaultData } = defaultWorkspaceData;
	const paths = getWorkspacePath(fileName);
	const promises = [
		FileSystemManager.createFileIfNotExists(paths.data, defaultData),
		FileSystemManager.createFileIfNotExists(paths.history, []),
		FileSystemManager.createFileIfNotExists(paths.uiMetadata, uiMetadata),
		FileSystemManager.createFileIfNotExists(paths.metadata, workspace),
		FileSystemManager.createFileIfNotExists(paths.secrets, []),
	];
	const results = await Promise.all(promises);
	return results.includes(true);
}

export const WorkspaceDataManager = {
	loadSprocketFile,
	exportData,
	initializeWorkspace,
	getWorkspacePath,
	processOrphans,
	saveData,
};
