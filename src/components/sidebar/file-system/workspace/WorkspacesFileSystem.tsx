import { InlineItemName } from '@/components/shared/InlineItemName';
import { SprocketModal } from '@/components/shared/modals/SprocketModal';
import { useScrollbarTheme } from '@/hooks/useScrollbarTheme';
import { ActiveSelect } from '@/state/active/selectors';
import { saveActiveData } from '@/state/active/thunks';
import { GlobalSelect } from '@/state/global/selectors';
import { GlobalActions } from '@/state/global/slice';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import type { WorkspaceMetadata } from '@/types/data/workspace';
import { ImportExport, RemoveCircle, Save } from '@mui/icons-material';
import { Box, Button, Stack, Typography } from '@mui/joy';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { SideDrawerHeader } from '../../SideDrawerHeader';
import { ActiveWorkspaceFileCard } from './ActiveWorkspaceFileCard';
import { ImportSelector } from './ImportSelector';
import { WorkspaceFileCard } from './WorkspaceFileCard';

export function WorkspacesFileSystem() {
	const [switchingTo, setSwitchingTo] = useState<WorkspaceMetadata | undefined>(undefined);
	const [isImportOpen, setIsImportOpen] = useState(false);
	const isModified = useSelector(ActiveSelect.hasBeenModifiedSinceLastSave);
	const { average } = useScrollbarTheme();
	const workspaces = useSelector(GlobalSelect.workspacesList);
	const activeWorkspace = useSelector(GlobalSelect.activeWorkspace);
	const dispatch = useAppDispatch();
	const inactiveWorkspaces = workspaces.filter((workspace) => workspace.fileName !== activeWorkspace?.fileName);
	const onOpenTab = (id: string) => {
		dispatch(UiActions.addTab(id));
		dispatch(UiActions.setSelectedTab(id));
	};
	const switchWorkspace = useCallback(
		async (save = false) => {
			setSwitchingTo(undefined);
			if (save) {
				await dispatch(saveActiveData());
			}
			dispatch(GlobalActions.setSelectedWorkspace(switchingTo));
		},
		[dispatch, switchingTo],
	);
	useEffect(() => {
		if (switchingTo != null && !isModified) {
			switchWorkspace();
		}
	}, [switchingTo, isModified, switchWorkspace]);
	return (
		<>
			<SideDrawerHeader
				content="Workspaces"
				menuOptions={[
					{
						label: 'Import From File',
						onClick: () => setIsImportOpen(true),
						Icon: ImportExport,
					},
				]}
			/>
			<Stack gap={1} sx={{ ...average, p: 1, flex: 1, minHeight: '1px', overflow: 'auto' }}>
				{activeWorkspace != null && (
					<Box mb={1}>
						<ActiveWorkspaceFileCard onOpenTab={onOpenTab} workspace={activeWorkspace} />
					</Box>
				)}
				{inactiveWorkspaces.map((workspace) => (
					<div key={workspace.fileName}>
						<WorkspaceFileCard
							onSwitchTo={() => setSwitchingTo(workspace)}
							onOpenTab={onOpenTab}
							workspace={workspace}
						/>
					</div>
				))}
			</Stack>
			<SprocketModal
				size="sm"
				open={isModified && switchingTo != null}
				onClose={() => setSwitchingTo(undefined)}
				title="Switch Active Workspace"
				actions={
					<>
						<Button color="warning" startDecorator={<RemoveCircle />} onClick={() => switchWorkspace()}>
							Switch
						</Button>
						<Button sx={{ width: '70%' }} startDecorator={<Save />} onClick={() => switchWorkspace(true)}>
							Save and Switch
						</Button>
					</>
				}
			>
				<Typography>
					Would you like to save workspace <InlineItemName item={activeWorkspace} /> before switching to workspace{' '}
					<InlineItemName item={switchingTo} />?
				</Typography>
			</SprocketModal>
			<ImportSelector open={isImportOpen} onClose={() => setIsImportOpen(false)} />
		</>
	);
}
