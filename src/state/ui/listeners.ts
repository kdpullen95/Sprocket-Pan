import type { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { ItemActions } from '../items';
import { type RootState } from '../store';
import { UiActions } from './slice';

const openTabsListener = createListenerMiddleware<RootState, ThunkDispatch<RootState, Action, Action>>();

const allActions = Object.values(ItemActions);
const isCreateAction = isAnyOf(...allActions.map((action) => action.create.fulfilled));

openTabsListener.startListening({
	matcher: isCreateAction,
	effect: ({ payload }, { dispatch }) => {
		dispatch(UiActions.addTab(payload));
		dispatch(UiActions.setSelectedTab(payload));
	},
});

export { openTabsListener };
