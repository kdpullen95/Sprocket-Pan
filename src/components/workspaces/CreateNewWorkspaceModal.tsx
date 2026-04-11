import { GlobalSelect } from '@/state/global/selectors';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { toValidFolderName } from '@/utils/string';
import { AddCircle } from '@mui/icons-material';
import {
	Button,
	CircularProgress,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControl,
	FormHelperText,
	FormLabel,
	Input,
	Modal,
	ModalDialog,
	Stack,
} from '@mui/joy';
import { useState } from 'react';
import { useSelector } from 'react-redux';

interface CreateNewWorkspaceModalProps {
	open: boolean;
	closeFunc: () => void;
}

export function CreateNewWorkspaceModal({ open, closeFunc }: CreateNewWorkspaceModalProps) {
	const workspaces = useSelector(GlobalSelect.workspacesList);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();
	const fileName = toValidFolderName(name).substring(0, 25);
	const isEmpty = fileName === '';
	const alreadyExists = workspaces.some((workspace) => workspace.fileName === fileName);

	const reset = () => {
		setDescription('');
		setName('');
		setLoading(false);
	};

	const onClose = () => {
		reset();
		closeFunc();
	};

	function onCreate() {
		setLoading(true);
		dispatch(
			ItemActions.workspace.create({
				name,
				description,
				lastModified: new Date().getTime(),
				fileName,
			}),
		);
		onClose();
	}

	return (
		<Modal open={open} onClose={onClose}>
			<ModalDialog variant="outlined" role="alertdialog">
				<DialogTitle>Create a New Workspace</DialogTitle>
				<Divider />
				<DialogContent sx={{ minWidth: '500px' }}>
					<Stack gap={2}>
						<FormControl>
							<FormLabel>Name</FormLabel>
							<Input
								placeholder="New Workspace Name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								error={alreadyExists}
							/>
							{!isEmpty && (
								<FormHelperText>
									This will be saved in the <code>{fileName}</code> folder.
								</FormHelperText>
							)}
							{alreadyExists && <FormHelperText>A workspace this folder name already exists.</FormHelperText>}
						</FormControl>
						<FormControl>
							<FormLabel>Short Description</FormLabel>
							<Input
								placeholder="New Workspace Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</FormControl>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						variant="solid"
						color="primary"
						onClick={onCreate}
						startDecorator={loading ? <CircularProgress /> : <AddCircle />}
						disabled={loading || isEmpty || alreadyExists}
					>
						Create
					</Button>
					<Button variant="plain" color="danger" onClick={onClose} disabled={loading}>
						Cancel
					</Button>
				</DialogActions>
			</ModalDialog>
		</Modal>
	);
}
