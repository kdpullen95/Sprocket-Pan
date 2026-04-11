import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { isModifiedListener } from './active/listeners/isModifiedListener';
import { stateAccessListener } from './active/listeners/stateAccessListener';
import { ActiveSlice } from './active/slice';
import { workspaceSelectionListener } from './global/listeners';
import { GlobalSlice } from './global/slice';
import { openTabsListener } from './ui/listeners';
import { UiSlice } from './ui/slice';

const rootReducer = combineReducers({
	[GlobalSlice.name]: GlobalSlice.reducer,
	[ActiveSlice.name]: ActiveSlice.reducer,
	[UiSlice.name]: UiSlice.reducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
	return configureStore({
		reducer: rootReducer,
		preloadedState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(
				isModifiedListener.middleware,
				stateAccessListener.middleware,
				openTabsListener.middleware,
				workspaceSelectionListener.middleware,
			),
	});
}

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch;
