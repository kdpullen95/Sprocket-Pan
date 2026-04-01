import { Box, Stack, useTheme } from '@mui/joy';
import { useState } from 'react';
import { Group, Panel, usePanelRef } from 'react-resizable-panels';
import { TabHeader } from '../header/TabHeader';
import { SprocketResizeHandle } from '../shared/SprocketResizeHandle';
import { SideDrawer } from '../sidebar/SideDrawer';
import { SidebarTabs } from '../sidebar/types';
import { VerticalMenu } from '../sidebar/VerticalMenu';
import { useAutosave } from './hooks/useAutosave';

const MIN_SIDEBAR_WIDTH = 5;

export function Workspace() {
	const [tab, setTab] = useState<SidebarTabs>(SidebarTabs.Workspaces);
	const theme = useTheme();
	const [expanded, setIsExpanded] = useState(false);
	const ref = usePanelRef();
	const setPanelTab = (newTab: SidebarTabs) => {
		if (ref.current?.isCollapsed()) {
			ref.current?.expand();
		} else if (newTab === tab) {
			ref.current?.collapse();
		}
		setTab(newTab);
	};
	useAutosave();
	return (
		<Stack
			direction="row"
			sx={{
				height: '100vh',
				width: '100vw',
				minHeight: '100vh',
				maxWidth: '100vw',
				overflow: 'hidden',
				backgroundColor: theme.palette.background.level1,
			}}
		>
			<Box sx={{ flex: 0, minWidth: '45px', maxWidth: '45px', height: '100%' }}>
				<VerticalMenu tab={tab} setTab={setPanelTab} showActive={expanded} />
			</Box>
			<Group orientation="horizontal">
				<Panel
					defaultSize={25}
					minSize={10}
					panelRef={ref}
					collapsible
					onResize={(size) => setIsExpanded(size.inPixels >= MIN_SIDEBAR_WIDTH)}
				>
					<SideDrawer tab={tab} />
				</Panel>
				<SprocketResizeHandle />
				<Panel defaultSize={75} minSize={50}>
					<TabHeader />
				</Panel>
			</Group>
		</Stack>
	);
}
