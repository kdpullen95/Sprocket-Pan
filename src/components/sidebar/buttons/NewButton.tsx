import { DropdownMenuItem } from '@/components/shared/DropdownMenuItem';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { useClickOutsideAlerter } from '@/hooks/useClickOutsideAlerter';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { ItemType } from '@/types/data/item';
import { AddBox, Code, CreateNewFolderSharp, TableChart } from '@mui/icons-material';
import { Box, Dropdown, IconButton, ListItemDecorator, Menu, MenuButton } from '@mui/joy';
import { useRef, useState } from 'react';

export function NewButton() {
	const [menuOpen, setMenuOpen] = useState(false);
	const dispatch = useAppDispatch();
	const ref = useRef<HTMLInputElement>(null);
	useClickOutsideAlerter({ ref, onOutsideClick: () => setMenuOpen(false) });

	const newEntities = [
		{
			name: 'Service',
			createFunc: () => uiActions.addToCreateQueue(ItemType.service),
			icon: <CreateNewFolderSharp fontSize="small" />,
		},
		{
			name: 'Environment',
			createFunc: () => uiActions.addToCreateQueue(ItemType.environment),
			icon: <TableChart fontSize="small" />,
		},
		{
			name: 'Script',
			createFunc: () => uiActions.addToCreateQueue(ItemType.script),
			icon: <Code fontSize="small" />,
		},
	];

	return (
		<SprocketTooltip text="Create New" disabled={menuOpen}>
			<Box>
				<Dropdown open={menuOpen} onOpenChange={(_event, isOpen) => setMenuOpen(isOpen)}>
					<MenuButton
						slots={{ root: IconButton }}
						slotProps={{ root: { variant: 'soft', color: 'neutral', size: 'sm' } }}
					>
						<AddBox />
					</MenuButton>
					<Menu ref={ref}>
						{newEntities.map((entity, index) => (
							<Box key={index}>
								<DropdownMenuItem
									onClick={() => {
										dispatch(entity.createFunc());
										setMenuOpen(false);
									}}
								>
									<ListItemDecorator>
										<IconButton aria-label={`Create New ${entity.name}`} size="sm">
											{entity.icon}
										</IconButton>
										New {entity.name}
									</ListItemDecorator>
								</DropdownMenuItem>
							</Box>
						))}
					</Menu>
				</Dropdown>
			</Box>
		</SprocketTooltip>
	);
}
