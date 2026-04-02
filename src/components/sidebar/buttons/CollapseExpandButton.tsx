import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { KeyboardArrowDownRounded, KeyboardArrowLeftRounded } from '@mui/icons-material';
import { IconButton } from '@mui/joy';

interface CollapseExpandButtonProps {
	collapsed: boolean;
	toggleCollapsed: () => void;
	variant?: 'plain' | 'soft';
}

export function CollapseExpandButton({ collapsed, toggleCollapsed, variant }: CollapseExpandButtonProps) {
	return (
		<SprocketTooltip text={collapsed ? 'Uncollapse' : 'Collapse'}>
			<IconButton size="sm" variant={variant ?? 'plain'} color="primary" onClick={toggleCollapsed}>
				{collapsed ? (
					<KeyboardArrowLeftRounded fontSize="small" color="primary" />
				) : (
					<KeyboardArrowDownRounded fontSize="small" color="primary" />
				)}
			</IconButton>
		</SprocketTooltip>
	);
}
