import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { SprocketInput } from '@/components/shared/input/SprocketInput';
import { SprocketSwitch } from '@/components/shared/input/SprocketSwitch';
import { AreYouSureModal } from '@/components/shared/modals/AreYouSureModal';
import { WorkspaceDataManager } from '@/managers/data/WorkspaceDataManager';
import { selectActiveState } from '@/state/active/selectors';
import { activeActions } from '@/state/active/slice';
import { saveActiveData } from '@/state/active/thunks';
import { selectActiveWorkspace } from '@/state/global/selectors';
import { useAppDispatch } from '@/state/store';
import { DeleteForever, FileUpload, Folder, Save, Warning } from '@mui/icons-material';
import { Alert, Button, FormControl, FormLabel, IconButton, Stack, Typography } from '@mui/joy';
import { open } from '@tauri-apps/plugin-dialog';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { SettingsTabProps } from './types';

export interface WorkspaceTabProps extends SettingsTabProps {
	goToWorkspaceSelection: () => void;
}

async function selectFolder(): Promise<string | null> {
	const selectedPath = await open({
		multiple: false,
		directory: true,
	});
	return Array.isArray(selectedPath) ? selectedPath[0] : selectedPath;
}

export function WorkspaceTab({ overlay, onChange, goToWorkspaceSelection }: WorkspaceTabProps) {
	const dispatch = useAppDispatch();
	const [deleteHistoryModalOpen, setDeleteHistoryModalOpen] = useState(false);
	const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
	const state = useSelector(selectActiveState);
	const workspace = useSelector(selectActiveWorkspace);

	const sync = overlay?.data?.sync;
	const updateSync = (value: typeof sync) => onChange({ data: { sync: value } });

	function save() {
		dispatch(saveActiveData());
	}

	function deleteHistory() {
		dispatch(activeActions.deleteAllHistory());
	}

	const exportData = () => WorkspaceDataManager.exportData(state, workspace!);

	return (
		<Stack spacing={2}>
			<FormControl sx={{ width: '250px' }}>
				<FormLabel>Workspace Synchronization</FormLabel>
				<SprocketSwitch
					sx={{ alignSelf: 'start' }}
					checked={sync?.enabled ?? false}
					onChange={(enabled) => onChange({ data: { sync: { enabled } } })}
				/>
			</FormControl>
			<SprocketInput
				sx={{ maxWidth: '600px' }}
				value={sync?.location ?? ''}
				onChange={(location) => updateSync({ location })}
				id="sync-file-path"
				label="Sync Path"
				hint="The path your synchronized files for this workspace are saved to and loaded from."
				rightContent={
					<SprocketTooltip text="Select Folder">
						<IconButton onClick={async () => updateSync({ location: await selectFolder() })}>
							<Folder />
						</IconButton>
					</SprocketTooltip>
				}
			/>
			{sync?.location == null && sync?.enabled && (
				<Alert startDecorator={<Warning />} sx={{ width: 'fit-content' }} color="warning">
					Workspace Synchronization will remain inactive if the sync location is empty.
				</Alert>
			)}
			<Typography>History</Typography>
			<Button
				sx={{ width: '250px' }}
				startDecorator={<DeleteForever />}
				color="danger"
				onClick={() => setDeleteHistoryModalOpen(true)}
				variant="outlined"
			>
				Delete All History
			</Button>
			<Typography>Workspace</Typography>
			<Button
				sx={{ width: '250px' }}
				startDecorator={<FileUpload />}
				color="primary"
				variant="outlined"
				onClick={exportData}
			>
				Export Workspace
			</Button>
			<Stack direction="row" gap={2}>
				<Button
					sx={{ width: '250px' }}
					startDecorator={<Save />}
					color="danger"
					variant="outlined"
					onClick={() => setIsQuitModalOpen(true)}
				>
					Exit to Workspace Selection Without Saving
				</Button>
				<Button
					sx={{ width: '250px' }}
					startDecorator={<Save />}
					color="success"
					variant="outlined"
					onClick={() => {
						save();
						goToWorkspaceSelection();
					}}
				>
					Save & Exit to Workspace Selection
				</Button>
			</Stack>
			<AreYouSureModal
				open={isQuitModalOpen}
				closeFunc={() => setIsQuitModalOpen(false)}
				action="Quit Without Saving"
				actionFunc={goToWorkspaceSelection}
			/>
			<AreYouSureModal
				open={deleteHistoryModalOpen}
				closeFunc={() => setDeleteHistoryModalOpen(false)}
				action="Delete All History"
				actionFunc={deleteHistory}
			/>
		</Stack>
	);
}
