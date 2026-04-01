import { Tooltip } from '@mui/joy';
import { TooltipProps } from '@mui/joy/Tooltip/TooltipProps';

interface SprocketTooltipProps extends Partial<TooltipProps> {
	text: string;
	disabled?: boolean;
}

export function SprocketTooltip({ children, text, disabled, sx, ...props }: SprocketTooltipProps) {
	return disabled ? (
		<>{children}</>
	) : (
		<Tooltip
			enterDelay={250}
			enterNextDelay={100}
			variant="outlined"
			arrow
			sx={{ maxWidth: '333px', textAlign: 'center', ...sx }}
			{...props}
			title={text}
		>
			{children}
		</Tooltip>
	);
}
