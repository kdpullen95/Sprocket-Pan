import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { GlobalSelect } from '@/state/global/selectors';
import { GlobalActions } from '@/state/global/slice';
import { useAppDispatch } from '@/state/store';
import { clearLeafProperties } from '@/utils/functions';
import { mergeDeep } from '@/utils/variables';
import { Box, Stack } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SettingsBar } from './SettingsBar';
import { SettingsTitle } from './SettingsTitle';
import { SettingsTabs } from './tabs/SettingsTabs';

export interface SettingsPanelProps {
	onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
	const { lastSaved, settings: workspaceSettings } = useSelector(ActiveSelect.slice);
	const globalSettings = useSelector(GlobalSelect.settings);
	const [unsavedSettings, setUnsavedSettings] = useState(workspaceSettings);
	const [unsavedGlobalSettings, setUnsavedGlobalSettings] = useState(globalSettings);
	const hasChanged = useMemo(() => {
		return (
			JSON.stringify(workspaceSettings) !== JSON.stringify(unsavedSettings) ||
			JSON.stringify(globalSettings) !== JSON.stringify(unsavedGlobalSettings)
		);
	}, [workspaceSettings, unsavedSettings, globalSettings, unsavedGlobalSettings]);
	const dispatch = useAppDispatch();
	function goToWorkspaceSelection() {
		dispatch(GlobalActions.setSelectedWorkspace(undefined));
	}
	const [search, setSearch] = useState('');
	return (
		<Stack height="75vh" justifyContent="stretch" alignItems="stretch" gap={1}>
			<SettingsTitle value={search} onChange={setSearch} />
			<Box sx={{ flex: 1, overflow: 'auto' }}>
				<SettingsTabs
					searchText={search}
					overlay={unsavedSettings}
					settings={unsavedGlobalSettings}
					onChange={(settings) => setUnsavedSettings(mergeDeep(unsavedSettings, settings, { allowUndefined: true }))}
					onUpdateGlobal={(settings) => {
						setUnsavedGlobalSettings(mergeDeep(unsavedGlobalSettings, settings));
						const nullOverride = structuredClone(settings);
						clearLeafProperties(nullOverride, undefined);
						setUnsavedSettings(mergeDeep(unsavedSettings, nullOverride, { allowUndefined: true }));
					}}
					goToWorkspaceSelection={goToWorkspaceSelection}
				/>
			</Box>
			<SettingsBar
				onSave={() => {
					dispatch(ActiveActions.insertSettings(unsavedSettings));
					dispatch(GlobalActions.insertSettings(unsavedGlobalSettings));
				}}
				onClose={onClose}
				overlay={unsavedSettings}
				settings={unsavedGlobalSettings}
				hasChanged={hasChanged}
				lastSaved={lastSaved}
			/>
		</Stack>
	);
}
