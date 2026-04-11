import { FluentCode } from '@/assets/icons/fluent/FluentCode';
import { FluentCube } from '@/assets/icons/fluent/FluentCube';
import { FluentList } from '@/assets/icons/fluent/FluentList';
import { ActiveSelect } from '@/state/active/selectors';
import { Workspaces } from '@mui/icons-material';
import { Box, Sheet, Stack, useTheme } from '@mui/joy';
import { useSelector } from 'react-redux';
import { SettingsPanel } from '../settings/SettingsPanel';
import { OpenSettingsButton } from '../shared/buttons/OpenSettingsButton';
import { EnvironmentBadge } from '../shared/EnvironmentBadge';
import { TrapezoidalSheet } from '../shared/flair/TrapezoidalSheet';
import { SaveButton } from './buttons/SaveButton';
import type { SidebarTabButtonProps } from './buttons/SidebarTabButton';
import { SidebarTabButton } from './buttons/SidebarTabButton';
import { SidebarTabs } from './types';

type VerticalMenuProps = Pick<SidebarTabButtonProps, 'tab' | 'setTab' | 'showActive'>;

export function VerticalMenu(args: VerticalMenuProps) {
	const theme = useTheme();
	const environment = useSelector(ActiveSelect.selectedEnvironmentValue);
	return (
		<Sheet sx={{ width: '100%', height: '100%', backgroundColor: theme.palette.background.level2 }}>
			<Stack alignItems="stretch" justifyContent="stretch" height="100%">
				<Stack alignItems="center" justifyContent="center" width="100%" height="45px">
					<SaveButton />
				</Stack>
				<TrapezoidalSheet
					color="primary"
					variant="soft"
					sx={{
						py: '45px',
					}}
					vertical
				>
					<SidebarTabButton {...args} value={SidebarTabs.Workspaces}>
						<Workspaces />
					</SidebarTabButton>
					<SidebarTabButton {...args} value={SidebarTabs.Environments}>
						<EnvironmentBadge environment={environment}>
							<FluentCube />
						</EnvironmentBadge>
					</SidebarTabButton>
					<SidebarTabButton {...args} value={SidebarTabs.Scripts}>
						<FluentCode />
					</SidebarTabButton>
					<SidebarTabButton {...args} value={SidebarTabs.Services}>
						<FluentList />
					</SidebarTabButton>
				</TrapezoidalSheet>
				<Box flex={1} minHeight="100px" />
				<OpenSettingsButton Content={SettingsPanel} />
			</Stack>
		</Sheet>
	);
}
