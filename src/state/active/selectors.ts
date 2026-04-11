import { OrderedKeyValuePairs } from '@/classes/OrderedKeyValuePairs';
import { EnvironmentContextResolver } from '@/managers/EnvironmentContextResolver';
import { queryParamsToString } from '@/utils/application';
import { mergeDeep } from '@/utils/variables';
import { createSelector } from '@reduxjs/toolkit';
import { GlobalSelect } from '../global/selectors';
import { ActiveSlice } from './slice';

const selectActiveState = ActiveSlice.selectSlice;

const selectSelectedEnvironment = createSelector(selectActiveState, (state) => state.selectedEnvironment);

const selectSelectedEnvironmentValue = createSelector(selectActiveState, (state) =>
	state.selectedEnvironment == null ? null : state.environments[state.selectedEnvironment],
);

// we're handling state secrets lol
const selectSecrets = createSelector(selectActiveState, (state) => state.secrets);

const selectEndpoints = createSelector(selectActiveState, (state) => state.endpoints);

const selectServices = createSelector(selectActiveState, (state) => state.services);

const selectSelectedServiceEnvironments = createSelector(
	selectActiveState,
	(state) => state.selectedServiceEnvironments,
);

const selectEnvironments = createSelector(selectActiveState, (state) => {
	return state.environments;
});

const selectEnvironmentIds = createSelector(selectEnvironments, (environments) => {
	return Object.values(environments).map((env) => env.id);
});

const selectRequests = createSelector(selectActiveState, (state) => state.requests);

const selectHistory = createSelector(selectActiveState, (state) => state.history);

const selectHistoryById = createSelector([selectHistory, (_, id?: string) => id], (history, id) =>
	id == null ? [] : (history[id] ?? []),
);

const selectFullRequestInfoById = createSelector(
	[selectRequests, selectEndpoints, selectServices, (_, id: string) => id],
	(requests, endpoints, services, id) => {
		const request = requests[id];
		const endpoint = endpoints[request?.endpointId];
		const service = services[endpoint?.serviceId];
		return {
			request,
			endpoint,
			service,
		};
	},
);

const selectUiMetadata = createSelector([selectActiveState, GlobalSelect.slice], (activeState, globalState) =>
	mergeDeep(globalState.uiMetadata, activeState.uiMetadata),
);

const selectAllItems = createSelector(selectActiveState, GlobalSelect.slice, (active, global) => ({
	environments: active.environments,
	services: active.services,
	requests: active.requests,
	endpoints: active.endpoints,
	scripts: active.scripts,
	workspaces: global.workspaces,
}));

const selectIdSpecificUiMetadata = createSelector(selectUiMetadata, (state) => state.idSpecific);

const selectUiMetadataById = createSelector(
	[selectIdSpecificUiMetadata, (_, id: string) => id],
	(state, id) => state[id],
);

const selectWorkspaceSettings = createSelector(selectActiveState, (state) => state?.settings);

const selectSettings = createSelector(GlobalSelect.settings, selectWorkspaceSettings, (global, workspace) =>
	mergeDeep(global, workspace),
);

const selectZoomLevel = createSelector(selectSettings, (state) => state.theme.zoom);

const selectDefaultTheme = createSelector(selectSettings, (state) => state.theme.base);

const selectTheme = createSelector(selectSettings, (state) => state.theme);

const selectSaveStateTimestamps = createSelector(selectActiveState, (state) => ({
	modified: state.lastModified,
	saved: state.lastSaved,
}));

const selectScripts = createSelector(selectActiveState, (state) => state.scripts);

const selectHasBeenModifiedSinceLastSave = createSelector(
	selectSaveStateTimestamps,
	(time) => time.modified > time.saved,
);

const selectEnvironmentSnippets = createSelector([selectActiveState, (_, id: string) => id], (state, id) => {
	const requestData = state.requests[id];
	const endpointData = state.endpoints[requestData?.endpointId];
	const serviceData = state.services[endpointData?.serviceId];
	const servEnvId = state.selectedServiceEnvironments[serviceData.id];
	const fullQueryParams = new OrderedKeyValuePairs(endpointData.baseQueryParams, requestData.queryParams);
	let query = queryParamsToString(fullQueryParams.toArray());
	if (query) {
		query = `?${query}`;
	}
	return EnvironmentContextResolver.stringWithVarsToSnippet(`${serviceData.baseUrl}${endpointData.url}${query}`, {
		secrets: state.secrets,
		servEnv: servEnvId == null ? null : serviceData.localEnvironments[servEnvId],
		reqEnv: requestData.environmentOverride,
		rootEnv: state.selectedEnvironment == null ? null : state.environments[state.selectedEnvironment],
		rootAncestors: Object.values(state.environments),
	});
});

const selectSyncMetadata = createSelector(selectActiveState, (state) => state.syncMetadata);

export const ActiveSelect = {
	slice: selectActiveState,
	selectedEnvironment: selectSelectedEnvironment,
	selectedEnvironmentValue: selectSelectedEnvironmentValue,
	secrets: selectSecrets,
	endpoints: selectEndpoints,
	services: selectServices,
	selectedServiceEnvironments: selectSelectedServiceEnvironments,
	environments: selectEnvironments,
	environmentIds: selectEnvironmentIds,
	requests: selectRequests,
	history: selectHistory,
	historyById: selectHistoryById,
	fullRequestInfoById: selectFullRequestInfoById,
	uiMetadata: selectUiMetadata,
	allItems: selectAllItems,
	idSpecificUiMetadata: selectIdSpecificUiMetadata,
	uiMetadataById: selectUiMetadataById,
	workspaceSettings: selectWorkspaceSettings,
	settings: selectSettings,
	zoomLevel: selectZoomLevel,
	defaultTheme: selectDefaultTheme,
	theme: selectTheme,
	saveStateTimestamps: selectSaveStateTimestamps,
	scripts: selectScripts,
	hasBeenModifiedSinceLastSave: selectHasBeenModifiedSinceLastSave,
	syncMetadata: selectSyncMetadata,
	environmentSnippets: selectEnvironmentSnippets,
} as const;
