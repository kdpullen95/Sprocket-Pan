import { GlobalDataManager } from '@/managers/data/GlobalDataManager';
import { GlobalSelect } from '@/state/global/selectors';
import { GlobalActions } from '@/state/global/slice';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import { Box, Container, Stack, Typography, useTheme } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { GlobalSettingsPanel } from '../settings/GlobalSettingsPanel';
import { OpenSettingsButton } from '../shared/buttons/OpenSettingsButton';
import { CreateNewWorkspaceModal } from './CreateNewWorkspaceModal';
import { NewWorkspaceCard } from './NewWorkspaceCard';
import { WorkspaceEntry } from './WorkspaceEntry';

export function WorkspaceSelector() {
	const workspaces = useSelector(GlobalSelect.workspacesList);
	const [createNewModalOpen, setCreateNewModalOpen] = useState(false);
	const dispatch = useAppDispatch();
	const theme = useTheme();

	async function updateWorkspaceSlice() {
		const workspaces = await GlobalDataManager.getWorkspaces();
		const data = await GlobalDataManager.getGlobalData();
		dispatch(GlobalActions.setData(data));
		dispatch(GlobalActions.setWorkspaces(workspaces));
	}

	useEffect(() => {
		updateWorkspaceSlice();
	}, []);

	return (
		<>
			<Box mb="30px" sx={{ backgroundColor: theme.palette.background.surface }} p={2}>
				<Box sx={{ position: 'absolute', top: 20, left: 15 }}>
					<OpenSettingsButton Content={GlobalSettingsPanel} />
				</Box>
				<Typography sx={{ textAlign: 'center' }} level="h2">
					Select a Workspace
				</Typography>
			</Box>
			<Container maxWidth="xl" sx={{ pb: 4 }}>
				<Stack direction="row" flexWrap="wrap" gap={4} justifyContent="center" width="100%" alignItems="stretch">
					{workspaces.map((workspace) => (
						<WorkspaceEntry
							key={workspace.fileName}
							workspace={workspace}
							onDelete={() => dispatch(UiActions.addToDeleteQueue(workspace.id))}
						/>
					))}
					<NewWorkspaceCard onCreate={() => setCreateNewModalOpen(true)} />
				</Stack>
			</Container>
			<CreateNewWorkspaceModal open={createNewModalOpen} closeFunc={() => setCreateNewModalOpen(false)} />
		</>
	);
}
