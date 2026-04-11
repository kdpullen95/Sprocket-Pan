import { AutoFixHigh } from '@mui/icons-material';
import type { IconButtonProps } from '@mui/joy';
import { IconButton } from '@mui/joy';
import { SprocketTooltip } from '../SprocketTooltip';

export function FormatButton(props: IconButtonProps) {
	return (
		<SprocketTooltip text="Format">
			<IconButton {...props}>
				<AutoFixHigh />
			</IconButton>
		</SprocketTooltip>
	);
}
