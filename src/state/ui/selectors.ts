import { getValidIdsFromSearchTerm } from '@/utils/search';
import { createSelector } from '@reduxjs/toolkit';
import { ActiveSelect } from '../active/selectors';
import { UiSlice } from './slice';

const UiSelectState = UiSlice.selectSlice;

const selectSelectedTab = createSelector(UiSelectState, (state) => state.selectedTab);

const selectPeekHistory = createSelector(UiSelectState, ({ tabsHistoryPosition, tabsHistory }) => {
	const length = tabsHistory.length;
	return {
		next: tabsHistoryPosition === length - 1 ? null : tabsHistoryPosition + 1,
		previous: tabsHistoryPosition <= 0 ? null : tabsHistoryPosition - 1,
	};
});

const selectNextForDeletion = createSelector(UiSelectState, ({ deleteQueue }) => {
	return deleteQueue[0];
});

const selectNextForDiff = createSelector(UiSelectState, ({ diffQueue }) => {
	return diffQueue[0];
});

const selectSearchText = createSelector(UiSelectState, (state) => state.searchText);

const selectFilteredIds = createSelector(
	[selectSearchText, ActiveSelect.services, ActiveSelect.endpoints, ActiveSelect.requests],
	(searchText, services, endpoints, requests) =>
		searchText === '' ? null : getValidIdsFromSearchTerm(searchText, { services, endpoints, requests }),
);

const selectFilteredNestedIds = createSelector(
	[selectFilteredIds, (_, nestedIds: string[]) => nestedIds],
	(filteredIds, nestedIds) => (filteredIds == null ? nestedIds : nestedIds.filter(filteredIds.has.bind(filteredIds))),
);

const selectIsActiveTab = createSelector(
	[selectSelectedTab, (_, id: string) => id],
	(activeTab, id) => activeTab === id,
);

const selectIsLoadingWorkspace = createSelector(UiSelectState, (state) => state.isLoadingWorkspace);

const selectOrphans = createSelector(UiSelectState, (state) => state.orphans);

const selectToast = createSelector(UiSelectState, (state) => state.toast);

const selectTabs = createSelector(UiSelectState, (state) => state.tabs);

export const UiSelect = {
	slice: UiSelectState,
	selectedTab: selectSelectedTab,
	peekHistory: selectPeekHistory,
	nextForDeletion: selectNextForDeletion,
	nextForDiff: selectNextForDiff,
	searchText: selectSearchText,
	filteredIds: selectFilteredIds,
	filteredNestedIds: selectFilteredNestedIds,
	isSelectedTab: selectIsActiveTab,
	isLoadingWorkspace: selectIsLoadingWorkspace,
	orphans: selectOrphans,
	toast: selectToast,
	tabs: selectTabs,
} as const;
