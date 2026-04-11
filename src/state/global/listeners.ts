import { WorkspaceDataManager } from '@/managers/data/WorkspaceDataManager';
import { filterOldHistoryEntries, getSettingsFromState } from '@/utils/application';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import { ActiveActions } from '../active/slice';
import type { RootState } from '../store';
import { UiActions } from '../ui/slice';

const workspaceSelectionListener = createListenerMiddleware<
	RootState,
	ThunkDispatch<RootState, undefined, UnknownAction>
>();

workspaceSelectionListener.startListening({
	predicate: (_, currentState, previousState) => {
		return currentState.global.activeWorkspace !== previousState.global.activeWorkspace;
	},
	effect: async (_, { dispatch, getState }) => {
		const global = getState().global;
		dispatch(ActiveActions.reset());
		dispatch(UiActions.reset());
		if (global.activeWorkspace != null) {
			dispatch(UiActions.setIsLoadingWorkspace(true));
			const data = await WorkspaceDataManager.initializeWorkspace(global.workspaces[global.activeWorkspace]);
			const settings = getSettingsFromState({ global, active: data });
			// TODO: I'd love to move this filtering somewhere more obvious or at least adjacent to other parsing.
			data.history = filterOldHistoryEntries(data.history, settings.history.maxDays);
			dispatch(ActiveActions.setFullState(data));
			if (settings.data.validation.enabled) {
				const orphans = await WorkspaceDataManager.processOrphans(data, global.workspaces[global.activeWorkspace]);
				if (orphans.endpoints.length > 0 || orphans.requests.length > 0) {
					dispatch(UiActions.setOrphans(orphans));
				}
			}
			dispatch(UiActions.setIsLoadingWorkspace(false));
		}
	},
});

export { workspaceSelectionListener };
