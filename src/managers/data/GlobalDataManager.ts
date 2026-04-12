import { DEFAULT_SETTINGS } from '@/constants/defaults';
import type { GlobalState } from '@/state/global/slice';
import type { GlobalData } from '@/types/data/global';
import type { WorkspaceMetadata } from '@/types/data/workspace';
import { mergeDeep } from '@/utils/variables';
import { FileSystemManager } from '../file-system/FileSystemManager';
import { FileSystemWorker } from '../file-system/FileSystemWorker';
import { SaveUpdateManager } from '../SaveUpdateManager';
import { WorkspaceDataManager } from './WorkspaceDataManager';

const PATH = 'global.json';

async function createWorkspace({ fileName, ...workspace }: WorkspaceMetadata) {
	const paths = WorkspaceDataManager.getWorkspacePath(fileName);
	return FileSystemManager.createWorkspace(paths, workspace);
}

async function updateWorkspace({ fileName, ...workspace }: WorkspaceMetadata) {
	const paths = WorkspaceDataManager.getWorkspacePath(fileName);
	return FileSystemManager.updateWorkspace(paths, workspace);
}

async function getWorkspaces() {
	const ret: Record<string, WorkspaceMetadata> = {};
	const { list, updated } = SaveUpdateManager.updateWorkspaces(await FileSystemManager.getWorkspaces());
	list.forEach((workspace) => {
		ret[workspace.id] = workspace;
	});
	updated.forEach((id) => {
		updateWorkspace(ret[id]);
	});
	return ret;
}

function deleteWorkspace(name: string) {
	const paths = WorkspaceDataManager.getWorkspacePath(name);
	return FileSystemManager.deleteWorkspace(paths);
}

async function getGlobalData(): Promise<GlobalData> {
	if (await FileSystemWorker.exists(GlobalDataManager.PATH)) {
		const globalData = JSON.parse(await FileSystemWorker.readTextFile(GlobalDataManager.PATH)) as GlobalData;
		// settings gains new properties often, so as an exception to our normal update logic,
		// we merge settings with the Default to populate new fields
		globalData.settings = mergeDeep(DEFAULT_SETTINGS, globalData.settings);
		return globalData;
	}
	return { uiMetadata: { idSpecific: {} }, lastSaved: new Date().getTime(), settings: DEFAULT_SETTINGS };
}

async function saveGlobalData({ activeWorkspace, workspaces, ...state }: GlobalState) {
	return FileSystemWorker.upsertFile({ path: GlobalDataManager.PATH, content: JSON.stringify(state) });
}

export const GlobalDataManager = {
	saveGlobalData,
	getGlobalData,
	deleteWorkspace,
	PATH,
	getWorkspaces,
	updateWorkspace,
	createWorkspace,
};
