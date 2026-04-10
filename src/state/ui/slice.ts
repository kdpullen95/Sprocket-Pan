import { ToastProps } from '@/components/root/Toasts';
import { OrphanData } from '@/managers/data/WorkspaceDataManager';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { SelectedResponse } from '../../components/root/overlays/ResponseDiffOverlay/ResponseSelectForm';
import { log } from '../../utils/logging';

export type DiffQueueEntry = { original: SelectedResponse; modified: SelectedResponse };

export interface UiState {
	selectedTab: string | null;
	tabs: string[];
	tabsHistory: string[];
	tabsHistoryPosition: number;
	deleteQueue: string[];
	diffQueue: DiffQueueEntry[];
	searchText: string;
	orphans: OrphanData | null;
	toast?: ToastProps;
	isLoadingWorkspace: boolean;
}

const initialState: UiState = {
	tabs: [],
	tabsHistory: [],
	tabsHistoryPosition: 0,
	selectedTab: null,
	deleteQueue: [],
	diffQueue: [],
	searchText: '',
	orphans: null,
	isLoadingWorkspace: false,
};

function closeTab(state: UiState, closeId: string) {
	state.tabs = state.tabs.filter((id) => id !== closeId);
	if (closeId === state.selectedTab) {
		state.selectedTab = state.tabs.at(-1) ?? null;
	}
}

export const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		closeTab: (state, { payload }: PayloadAction<string>) => {
			closeTab(state, payload);
		},
		closeTabs: (state, { payload }: PayloadAction<string[]>) => {
			payload.forEach((id) => closeTab(state, id));
		},
		closeOtherTabs: (state, { payload }: PayloadAction<string>) => {
			const arr = state.tabs.filter((id) => id !== payload);
			arr.forEach((id) => closeTab(state, id));
		},
		closeTabsDirectionally: (state, { payload }: PayloadAction<{ center: string; left?: boolean }>) => {
			const index = state.tabs.findIndex((tab) => tab === payload.center);
			if (index >= 0) {
				const arr = payload.left ? state.tabs.slice(0, index) : state.tabs.slice(index + 1, state.tabs.length);
				arr.forEach((id) => closeTab(state, id));
			}
		},
		addTabs: (state, action: PayloadAction<UiState['tabs']>) => {
			state.tabs = { ...state.tabs, ...action.payload };
		},
		addTab: (state, { payload }: PayloadAction<string>) => {
			if (!state.tabs.includes(payload)) {
				state.tabs.push(payload);
			}
		},
		setSelectedTab: (state, { payload }: PayloadAction<string>) => {
			state.selectedTab = payload;
			if (payload !== state.tabsHistory[state.tabsHistoryPosition]) {
				state.tabsHistory.splice(state.tabsHistoryPosition + 1, Infinity, payload);
				log.trace(`Selecting ${payload} tab`, 1);
				state.tabsHistoryPosition = state.tabsHistory.length - 1;
			}
		},
		clearTabs: (state) => {
			state.tabs = [];
			state.tabsHistory = [];
			state.tabsHistoryPosition = 0;
			state.selectedTab = null;
		},
		addToDiffQueue: (state, { payload }: PayloadAction<SelectedResponse | DiffQueueEntry>) => {
			if ('original' in payload) {
				state.diffQueue.push(payload);
			} else {
				state.diffQueue.push({ original: payload, modified: payload });
			}
		},
		addToDeleteQueue: (state, { payload }: PayloadAction<string>) => {
			state.deleteQueue.push(payload);
		},
		removeFromDeleteQueue: (state, { payload }: PayloadAction<string>) => {
			state.deleteQueue.splice(
				state.deleteQueue.findIndex((id) => id === payload),
				1,
			);
		},
		popDiffQueue: (state) => {
			state.diffQueue.pop();
		},
		setSearchText: (state, { payload }: PayloadAction<string>) => {
			state.searchText = payload;
		},
		setSelectedTabFromHistory: (state, { payload }: PayloadAction<number | null>) => {
			if (payload != null) {
				const id = state.tabsHistory[payload];
				if (id != undefined) {
					state.tabs.push(id);
					state.selectedTab = id;
					state.tabsHistoryPosition = payload;
				}
			}
		},
		setOrphans: (state, { payload }: PayloadAction<UiState['orphans']>) => {
			state.orphans = payload;
		},
		toast: (state, { payload }: PayloadAction<ToastProps>) => {
			state.toast = payload;
		},
		clearToast: (state) => {
			state.toast = undefined;
		},
		setIsLoadingWorkspace: (state, { payload }: PayloadAction<boolean>) => {
			state.isLoadingWorkspace = payload;
		},
		reset: () => initialState,
	},
});

export const uiActions = uiSlice.actions;
