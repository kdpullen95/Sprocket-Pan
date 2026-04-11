import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import { Difference } from '@mui/icons-material';
import { IconButton } from '@mui/joy';

interface OpenDiffToolButtonProps {
	historyIndex: number;
	id: string;
}

export function OpenDiffToolButton({ historyIndex, id }: OpenDiffToolButtonProps) {
	const dispatch = useAppDispatch();

	const openDiffModal = () => {
		dispatch(UiActions.addToDiffQueue({ id, index: historyIndex }));
	};
	return (
		<SprocketTooltip text="Show Difference From Another Response">
			<IconButton onClick={openDiffModal}>
				<Difference />
			</IconButton>
		</SprocketTooltip>
	);
}
