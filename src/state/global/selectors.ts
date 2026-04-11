import { createSelector } from '@reduxjs/toolkit';
import { GlobalSlice } from './slice';

const selectGlobalState = GlobalSlice.selectSlice;

const selectWorkspaces = createSelector(selectGlobalState, (state) => state.workspaces);

const selectWorkspacesList = createSelector(selectWorkspaces, (workspaces) =>
	Object.values(workspaces).sort((a, b) => b.lastModified - a.lastModified),
);

const selectActiveWorkspace = createSelector(selectGlobalState, (state) =>
	state.activeWorkspace == null ? null : state.workspaces[state.activeWorkspace],
);

const selectGlobalSettings = createSelector(selectGlobalState, (state) => state.settings);

const selectGlobalLastSaved = createSelector(selectGlobalState, (state) => state.lastSaved);

export const GlobalSelect = {
	slice: selectGlobalState,
	workspaces: selectWorkspaces,
	workspacesList: selectWorkspacesList,
	activeWorkspace: selectActiveWorkspace,
	settings: selectGlobalSettings,
	lastSaved: selectGlobalLastSaved,
} as const;
