import { Box, Sheet, Typography } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SettingsTabs } from './tabs/SettingsTabs';
import { SettingsBar } from './SettingsBar';
import { SettingsPanelProps } from './SettingsPanel';
import { selectGlobalLastSaved, selectGlobalSettings } from '@/state/global/selectors';
import { globalActions } from '@/state/global/slice';
import { useAppDispatch } from '@/state/store';
import { mergeDeep } from '@/utils/variables';
import { SearchField } from '../shared/input/SearchField';

export function GlobalSettingsPanel({ onClose }: SettingsPanelProps) {
	const lastSaved = useSelector(selectGlobalLastSaved);
	const previousSettings = useSelector(selectGlobalSettings);
	const [unsavedSettings, setUnsavedSettings] = useState(previousSettings);
	const hasChanged = useMemo(() => {
		return JSON.stringify(previousSettings) !== JSON.stringify(unsavedSettings);
	}, [previousSettings, unsavedSettings]);
	const dispatch = useAppDispatch();
	const [search, setSearch] = useState('');
	const titleAndSearchHeight = 120;
	return (
		<Box height="75vh">
			<Box height={`${titleAndSearchHeight}px`}>
				<Box display="flex" justifyContent="center" alignItems="center" minWidth="100%">
					<Typography level="h1">Settings</Typography>
				</Box>
				<Box display="flex" justifyContent="end" alignItems="end" minWidth="100%">
					<Sheet sx={{ maxWidth: '600px', p: 2 }} variant="outlined" color="neutral">
						<SearchField onChange={setSearch} />
					</Sheet>
				</Box>
			</Box>
			<Box height={`calc(100% - ${titleAndSearchHeight}px)`}>
				<SettingsTabs
					searchText={search}
					settings={unsavedSettings}
					onChange={(settings) => setUnsavedSettings(mergeDeep(unsavedSettings, settings))}
				/>
				<SettingsBar
					onSave={() => dispatch(globalActions.insertSettings(unsavedSettings))}
					onClose={onClose}
					settings={unsavedSettings}
					hasChanged={hasChanged}
					lastSaved={lastSaved}
				/>
			</Box>
		</Box>
	);
}
