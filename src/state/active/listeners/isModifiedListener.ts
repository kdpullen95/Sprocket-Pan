import type { Action, ThunkDispatch } from '@reduxjs/toolkit';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import { ActiveActions, ActiveSlice } from '../slice';

const isModifiedListener = createListenerMiddleware<RootState, ThunkDispatch<RootState, Action, Action>>();

const isIgnoredSliceAction = isAnyOf(
	ActiveActions.setModifiedNow,
	ActiveActions.setFullState,
	ActiveActions.setSavedNow,
);

isModifiedListener.startListening({
	predicate: (_, currentState, previousState) => {
		// we want lastModified to be updated in all cases where it hasn't been
		// & we _don't_ want to update lastModified when saving either
		// so, we should only update lastModified in cases where neither lastSaved nor lastModified were changed
		// (implying the update was elsewhere in the state)
		return (
			currentState.active.lastModified === previousState.active.lastModified &&
			currentState.active.lastSaved === previousState.active.lastSaved
		);
	},
	effect: (action, { dispatch }) => {
		if (isIgnoredSliceAction(action) || !action.type.startsWith(ActiveSlice.name)) {
			return;
		}
		dispatch(ActiveActions.setModifiedNow());
	},
});

export { isModifiedListener };
