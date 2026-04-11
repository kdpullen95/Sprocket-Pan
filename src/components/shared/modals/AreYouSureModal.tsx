import { WarningRounded } from '@mui/icons-material';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Modal, ModalDialog, Typography } from '@mui/joy';
import type { ReactNode } from 'react';

interface AreYouSureModalProps {
	open: boolean;
	closeFunc: () => void;
	action: ReactNode;
	actionFunc: () => void;
}

export function AreYouSureModal({ open, closeFunc, actionFunc, action }: AreYouSureModalProps) {
	return (
		<Modal open={open} onClose={() => closeFunc()}>
			<ModalDialog variant="outlined" role="alertdialog" sx={{ maxWidth: '900px', width: '95%' }}>
				<DialogTitle>
					<WarningRounded />
					Confirmation
				</DialogTitle>
				<Divider />
				<DialogContent>
					<Typography>Are you sure you want to {action}?</Typography>
				</DialogContent>
				<DialogActions>
					<Button
						sx={{ maxWidth: '100%' }}
						variant="solid"
						color="danger"
						onClick={() => {
							closeFunc();
							actionFunc();
						}}
					>
						<span>Yes, {action}!</span>
					</Button>
					<Button variant="plain" color="neutral" onClick={() => closeFunc()}>
						Cancel
					</Button>
				</DialogActions>
			</ModalDialog>
		</Modal>
	);
}
