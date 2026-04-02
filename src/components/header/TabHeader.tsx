import { SprocketPanSvg } from '@/assets/icons/brands/SprocketPan';
import { useScrollbarTheme } from '@/hooks/useScrollbarTheme';
import { selectSettings } from '@/state/active/selectors';
import { useAppDispatch } from '@/state/store';
import { selectUiState } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { Box, Stack, TabPanel, Tabs } from '@mui/joy';
import { useTheme } from '@mui/joy/styles';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TabContent } from '../panels/TabContent';
import { TabRow } from './TabRow';

export function TabHeader() {
	const { tabs, selectedTab } = useSelector(selectUiState);
	const { guttered: scrollbarTheme } = useScrollbarTheme();
	const settings = useSelector(selectSettings);
	const theme = useTheme();
	const dispatch = useAppDispatch();
	useEffect(() => {
		document.getElementById(`tab_${selectedTab}`)?.scrollIntoView();
		const fileToScrollTo = document.getElementById(`file_${selectedTab}`);
		fileToScrollTo?.scrollIntoView({ block: 'center' });
	}, [selectedTab]);

	return (
		<>
			<Box height="0" width="100%" position="relative">
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
			</Box>
			<Tabs size="lg" value={selectedTab} onChange={(_, val) => dispatch(uiActions.setSelectedTab(val as string))}>
				<TabRow list={tabs} />
				{tabs.map((id, index) => (
					<TabPanel
						value={id}
						key={index}
						sx={{ padding: 0, height: 'calc(100vh - 45px)', overflow: 'auto', ...scrollbarTheme }}
					>
						<TabContent id={id} />
					</TabPanel>
				))}
			</Tabs>
		</>
	);
}
