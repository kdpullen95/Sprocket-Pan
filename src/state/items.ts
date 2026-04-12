import { ItemFactory } from '@/managers/data/ItemFactory';
import { ItemType } from '@/types/data/item';
import type {
	Endpoint,
	EndpointRequest,
	Environment,
	RootEnvironment,
	Script,
	Service,
	WorkspaceMetadata,
} from '@/types/data/workspace';
import { getDescendents } from '@/utils/getters';
import { sleep } from '@/utils/misc';
import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { ActiveSelect } from './active/selectors';
import { ActiveActions } from './active/slice';
import { GlobalSelect } from './global/selectors';
import { GlobalActions } from './global/slice';
import type { RootState } from './store';
import type { Create } from './types';
import { UiActions } from './ui/slice';

const selectRequest = createSelector([ActiveSelect.requests, (_, id?: string) => id], (requests, id) =>
	id == null ? null : requests[id],
);

const selectEndpoint = createSelector([ActiveSelect.endpoints, (_, id?: string) => id], (endpoints, id) =>
	id == null ? null : endpoints[id],
);

const selectEnvironment = createSelector(
	[ActiveSelect.environments, (_, id: string) => id],
	(environments, id) => environments[id],
);

const selectScript = createSelector(
	[ActiveSelect.scripts, (_, scriptName: string) => scriptName],
	(scripts, scriptName) => scripts[scriptName],
);

const selectService = createSelector([ActiveSelect.services, (_, id?: string) => id], (services, id) =>
	id == null ? null : services[id],
);

const selectWorkspace = createSelector([GlobalSelect.workspaces, (_, id?: string) => id], (workspaces, id) =>
	id == null ? null : workspaces[id],
);

// we need deletes to be thunks so that the tab is closed _first_. TODO: find an alternative?
const deletePrefix = 't/items/delete/';

function constructDeleteThunk(action: ActionCreatorWithPayload<string>, type: ItemType) {
	return createAsyncThunk<void, string, { state: RootState }>(deletePrefix + type, async (id, thunk) => {
		thunk.dispatch(UiActions.closeTabs([id, ...getDescendents(thunk.getState().active, id)]));
		// TODO: this sucks, is there any way to actually flush state and not batch these?? and still use redux and modern react???
		await sleep(50);
		thunk.dispatch(action(id));
	});
}

// in some cases, we want to get the new id back after creating an item,
// so these need to be thunks.
const createPrefix = 't/items/create/';

const createRequest = createAsyncThunk<string, Create<EndpointRequest>, { state: RootState }>(
	createPrefix + 'request',
	(base, thunk) => {
		const newRequest = ItemFactory.request(base);
		thunk.dispatch(ActiveActions.insertRequest(newRequest));
		return newRequest.id;
	},
);

const createEndpoint = createAsyncThunk<string, Create<Endpoint>, { state: RootState }>(
	createPrefix + 'endpoint',
	({ requestIds, ...base } = {}, thunk) => {
		const state = thunk.getState().active;
		const newEndpoint = ItemFactory.endpoint(base);
		thunk.dispatch(ActiveActions.insertEndpoint(newEndpoint));
		// re: [''], we want at least one request made for a new endpoint automatically
		// this could be optimized with batch
		(requestIds ?? ['']).forEach(async (id) => {
			const newReqId = await thunk
				.dispatch(createRequest({ ...state.requests[id], endpointId: newEndpoint.id }))
				.unwrap();
			if (newEndpoint.defaultRequest === id || id === '') {
				thunk.dispatch(ActiveActions.updateEndpoint({ defaultRequest: newReqId, id: newEndpoint.id }));
			}
		});
		return newEndpoint.id;
	},
);

const createService = createAsyncThunk<string, Create<Service>, { state: RootState }>(
	createPrefix + 'service',
	({ endpointIds, ...base } = {}, thunk) => {
		const state = thunk.getState().active;
		const newService = ItemFactory.service(base);
		thunk.dispatch(ActiveActions.insertService(newService));
		endpointIds?.forEach((id) => {
			thunk.dispatch(createEndpoint({ ...state.endpoints[id], serviceId: newService.id }));
		});
		return newService.id;
	},
);

const createScript = createAsyncThunk<string, Create<Script>, { state: RootState }>(
	createPrefix + 'script',
	(base, thunk) => {
		const newScript = ItemFactory.script(base);
		thunk.dispatch(ActiveActions.insertScript(newScript));
		return newScript.id;
	},
);

const createEnvironment = createAsyncThunk<string, Create<RootEnvironment>, { state: RootState }>(
	createPrefix + 'environment',
	(base, thunk) => {
		const newEnv = ItemFactory.environment(base);
		thunk.dispatch(ActiveActions.insertEnvironment(newEnv));
		return newEnv.id;
	},
);

const createWorkspace = createAsyncThunk<string, Create<WorkspaceMetadata>, { state: RootState }>(
	createPrefix + 'workspace',
	(base, thunk) => {
		const newWorkspace = ItemFactory.workspace(base);
		thunk.dispatch(GlobalActions.insertWorkspace(newWorkspace));
		return newWorkspace.id;
	},
);

export const ItemActions = {
	endpoint: {
		duplicate: (base: Endpoint) => createEndpoint({ ...base, name: base.name + ' (Copy)' }),
		update: ActiveActions.updateEndpoint,
		delete: constructDeleteThunk(ActiveActions.deleteEndpoint, ItemType.endpoint),
		create: createEndpoint,
		select: selectEndpoint,
		property: 'endpoints',
	},
	service: {
		duplicate: (base: Service) => createService({ ...base, name: base.name + ' (Copy)' }),
		update: ActiveActions.updateService,
		delete: constructDeleteThunk(ActiveActions.deleteService, ItemType.service),
		create: createService,
		select: selectService,
		property: 'services',
	},
	request: {
		duplicate: (base: EndpointRequest) => createRequest({ ...base, name: base.name + ' (Copy)' }),
		update: ActiveActions.updateRequest,
		delete: constructDeleteThunk(ActiveActions.deleteRequest, ItemType.request),
		create: createRequest,
		select: selectRequest,
		property: 'requests',
	},
	script: {
		duplicate: (base: Script) => createScript({ ...base, name: base.name + ' (Copy)' }),
		update: ActiveActions.updateScript,
		delete: constructDeleteThunk(ActiveActions.deleteScript, ItemType.script),
		create: createScript,
		select: selectScript,
		property: 'scripts',
	},
	environment: {
		duplicate: (base: Environment) => createEnvironment({ ...base, name: base.name + ' (Copy)' }),
		update: ActiveActions.updateEnvironment,
		delete: constructDeleteThunk(ActiveActions.deleteEnvironment, ItemType.environment),
		create: createEnvironment,
		select: selectEnvironment,
		property: 'environments',
	},
	workspace: {
		duplicate: (base: WorkspaceMetadata) => createWorkspace({ ...base, name: base.name + ' (Copy)' }),
		update: GlobalActions.updateWorkspace,
		delete: constructDeleteThunk(GlobalActions.deleteWorkspace, ItemType.workspace),
		create: createWorkspace,
		select: selectWorkspace,
		property: 'workspaces',
	},
} as const;
