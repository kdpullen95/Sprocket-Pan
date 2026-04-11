import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { RedoRounded, UndoRounded } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/joy';
import { useSelector } from 'react-redux';
import { SprocketTooltip } from '../shared/SprocketTooltip';

export function UndoRedoTabsButton() {
	const { previous: goBackIndex, next: goForwardIndex } = useSelector(UiSelect.peekHistory);
	const dispatch = useAppDispatch();

	return (
		<Stack direction="row" spacing={0} justifyContent="flex-end">
			<SprocketTooltip text="Previous Tab">
				<IconButton
					disabled={goBackIndex == null}
					onClick={() => dispatch(UiActions.setSelectedTabFromHistory(goBackIndex))}
				>
					<UndoRounded />
				</IconButton>
			</SprocketTooltip>
			<SprocketTooltip text="Next Tab">
				<IconButton
					disabled={goForwardIndex == null}
					onClick={() => dispatch(UiActions.setSelectedTabFromHistory(goForwardIndex))}
				>
					<RedoRounded />
				</IconButton>
			</SprocketTooltip>
		</Stack>
	);
}
