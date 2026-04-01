import { MenuItem } from '@mui/joy';
import { MenuItemProps } from '@mui/joy/MenuItem/MenuItemProps';

export function DropdownMenuItem({ sx, ...props }: MenuItemProps) {
	return <MenuItem sx={{ pr: 3, ...sx }} {...props} />;
}
