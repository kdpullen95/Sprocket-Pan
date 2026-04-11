import { SprocketPanSvg } from '@/assets/icons/brands/SprocketPan';
import { useScrollbarTheme } from '@/hooks/useScrollbarTheme';
import { ActiveSelect } from '@/state/active/selectors';
import { UiSelect } from '@/state/ui/selectors';
import { Box, Stack } from '@mui/joy';
import { useTheme } from '@mui/joy/styles';
import { useSelector } from 'react-redux';
import { TabContent } from '../panels/TabContent';
import { HeaderTabRow } from './HeaderTabRow';

export function TabHeader() {
	const tabs = useSelector(UiSelect.tabs);
	const { guttered: scrollbarTheme } = useScrollbarTheme();
	const settings = useSelector(ActiveSelect.settings);
	const theme = useTheme();
	return (
		<Box height="100%" width="100%" position="relative">
			<Stack
				alignItems="center"
				justifyContent="center"
				position="absolute"
				sx={{ height: '100vh', width: '100%', overflow: 'hidden' }}
			>
				<SprocketPanSvg
					style={{
						width: 'auto',
						minHeight: '600px',
						height: '80%',
						opacity: settings.theme.decoration.opacity,
						fill: theme.palette.primary.outlinedActiveBg,
						stroke: theme.palette.primary.softActiveBg,
						strokeWidth: '5px',
					}}
				/>
			</Stack>
			<Stack
				position="absolute"
				sx={{
					height: '100%',
					width: '100%',
					maxWidth: '100%',
					overflow: 'hidden',
					backgroundColor: theme.palette.background.surface,
				}}
			>
				<HeaderTabRow />
				<Box
					sx={{
						flex: 1,
						overflow: 'auto',
						...scrollbarTheme,
					}}
				>
					{tabs.map((id) => (
						<TabContent key={id} id={id} />
					))}
				</Box>
			</Stack>
		</Box>
	);
}
