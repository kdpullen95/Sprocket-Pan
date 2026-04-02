import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { selectHasBeenModifiedSinceLastSave } from '@/state/active/selectors';
import { saveActiveData } from '@/state/active/thunks';
import { useAppDispatch } from '@/state/store';
import { Save } from '@mui/icons-material';
import { CircularProgress, IconButton } from '@mui/joy';
import Badge from '@mui/joy/Badge';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export function SaveButton() {
	const [loading, setLoading] = useState(false);
	const isModified = useSelector(selectHasBeenModifiedSinceLastSave);
	const dispatch = useAppDispatch();

	function save() {
		setLoading(true);
		dispatch(saveActiveData())
			.unwrap()
			.then(() => setTimeout(() => setLoading(false), 500));
	}

	return (
		<SprocketTooltip text="Save" placement="right">
			<Badge
				size="sm"
				invisible={!isModified}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				badgeInset="14%"
			>
				<IconButton variant="plain" color="neutral" onClick={save} disabled={!isModified || loading}>
					{loading ? <CircularProgress /> : <Save />}
				</IconButton>
			</Badge>
		</SprocketTooltip>
	);
}
