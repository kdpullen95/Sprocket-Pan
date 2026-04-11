import { StateAccessManager } from '@/managers/data/StateAccessManager';
import { log } from '@/utils/logging';
import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@reduxjs/toolkit';
import type { RootState } from '../../store';

const stateAccessListener = createListenerMiddleware<RootState, ThunkDispatch<RootState, undefined, UnknownAction>>();

stateAccessListener.startListening({
	predicate: (_, currentState, previousState) => {
		return currentState.active.scripts !== previousState.active.scripts;
	},
	effect: (_, stateAccess) => {
		log.info('stateAccess refreshed');
		StateAccessManager.stateAccess = stateAccess;
	},
});

export { stateAccessListener };
