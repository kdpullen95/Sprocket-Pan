import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { DialogTitle, Divider, Modal, ModalDialog } from '@mui/joy';
import { useSelector } from 'react-redux';
import { AdoptionOverlay } from '../overlays/AdoptionOverlay/AdoptionOverlay';

export function AdoptionModals() {
	const orphans = useSelector(UiSelect.orphans);
	const dispatch = useAppDispatch();

	const onClose = () => dispatch(UiActions.setOrphans(null));

	return (
		<Modal
			open={!!orphans}
			onClose={(_, reason) => {
				if (reason === 'backdropClick') {
					return;
				}
				onClose();
			}}
		>
			<ModalDialog variant="outlined" role="adoptiondialog">
				<DialogTitle>Orphaned Items Resolution</DialogTitle>
				<Divider />
				<AdoptionOverlay orphanData={orphans} />
			</ModalDialog>
		</Modal>
	);
}
