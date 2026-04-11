import { Box, Stack, Typography } from '@mui/joy';
import { SearchField } from '../shared/input/SearchField';

interface SettingsTitleProps {
	onChange: (str: string) => void;
	value: string;
}

export function SettingsTitle({ value, onChange }: SettingsTitleProps) {
	return (
		<Stack direction="row" alignItems="center" justifyContent="stretch" maxWidth="100%">
			<Box sx={{ flex: 0, minWidth: '25%' }}></Box>
			<Typography level="h3" sx={{ flex: 1, width: '100%', textAlign: 'center' }}>
				Settings
			</Typography>
			<Box sx={{ flex: 0, maxWidth: '25%', minWidth: '25%' }}>
				<SearchField value={value} onChange={onChange} />
			</Box>
		</Stack>
	);
}
