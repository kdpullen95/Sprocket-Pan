import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { DialogTitle, Divider, Modal, ModalClose, ModalDialog } from '@mui/joy';
import { useSelector } from 'react-redux';
import { ResponseDiffOverlay } from '../overlays/ResponseDiffOverlay/ResponseDiffOverlay';

export function DiffQueueModals() {
	const nextForDiff = useSelector(UiSelect.nextForDiff);
	const dispatch = useAppDispatch();

	return (
		<Modal open={!!nextForDiff} onClose={() => dispatch(UiActions.popDiffQueue())}>
			<ModalDialog variant="outlined" role="diffdialog">
				<ModalClose />
				<DialogTitle>Diff Tool - Compare Responses</DialogTitle>
				<Divider />
				<ResponseDiffOverlay initialSelection={nextForDiff} />
			</ModalDialog>
		</Modal>
	);
}
