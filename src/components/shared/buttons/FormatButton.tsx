import { AutoFixHigh } from '@mui/icons-material';
import { IconButton, IconButtonProps } from '@mui/joy';
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
