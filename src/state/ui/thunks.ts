import { createAsyncThunk } from '@reduxjs/toolkit';
import { ActiveActions } from '../active/slice';
import type { RootState } from '../store';

const collapseAll = createAsyncThunk<void, string[], { state: RootState }>('ui/collapseAll', (ids, thunk) => {
	ids.forEach((id) => thunk.dispatch(ActiveActions.setUiMetadataById({ id, collapsed: true })));
});

const expandAll = createAsyncThunk<void, string[], { state: RootState }>('ui/expandAll', (ids, thunk) => {
	ids.forEach((id) => thunk.dispatch(ActiveActions.setUiMetadataById({ id, collapsed: false })));
});

export const UiThunks = {
	collapseAll,
	expandAll,
};
