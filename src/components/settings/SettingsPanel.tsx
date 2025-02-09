import { Box, Typography } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SettingsTabs } from './tabs/SettingsTabs';
import { SettingsBar } from './SettingsBar';
import { selectActiveState, selectWorkspaceSettings } from '@/state/active/selectors';
import { activeActions } from '@/state/active/slice';
import { selectGlobalSettings } from '@/state/global/selectors';
import { globalActions } from '@/state/global/slice';
import { useAppDispatch } from '@/state/store';
import { mergeDeep } from '@/utils/variables';
import { SearchField } from '../shared/input/SearchField';

export interface SettingsPanelProps {
	onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
	const lastSaved = useSelector(selectActiveState).lastSaved;
	const workspaceSettings = useSelector(selectWorkspaceSettings);
	const globalSettings = useSelector(selectGlobalSettings);
	const [unsavedSettings, setUnsavedSettings] = useState(workspaceSettings);
	const hasChanged = useMemo(() => {
		return JSON.stringify(workspaceSettings) !== JSON.stringify(unsavedSettings);
	}, [workspaceSettings, unsavedSettings]);
	const dispatch = useAppDispatch();
	function goToWorkspaceSelection() {
		dispatch(globalActions.setSelectedWorkspace(undefined));
	}
	const [search, setSearch] = useState('');
	const titleAndSearchHeight = 120;
	return (
		<>
			<Box height="75vh">
				<Box height={`${titleAndSearchHeight}px`}>
					<Box display="flex" justifyContent="center" alignItems="center" minWidth="100%">
						<Typography level="h1">Settings</Typography>
					</Box>
					<Box display="flex" justifyContent="end" alignItems="end" minWidth="100%">
						<Box sx={{ maxWidth: '600px' }} color="neutral">
							<SearchField onChange={setSearch} />
						</Box>
					</Box>
				</Box>
				<Box height={`calc(100% - ${titleAndSearchHeight}px)`}>
					<SettingsTabs
						searchText={search}
						overlay={unsavedSettings}
						settings={globalSettings}
						onChange={(settings) => setUnsavedSettings(mergeDeep(unsavedSettings, settings, { allowUndefined: true }))}
						goToWorkspaceSelection={goToWorkspaceSelection}
					/>
					<SettingsBar
						onSave={() => dispatch(activeActions.insertSettings(unsavedSettings))}
						onClose={onClose}
						overlay={unsavedSettings}
						settings={globalSettings}
						hasChanged={hasChanged}
						lastSaved={lastSaved}
					/>
				</Box>
			</Box>
		</>
	);
}
