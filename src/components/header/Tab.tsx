import { tabTypeIcon } from '@/constants/components';
import { useContextMenu } from '@/hooks/useContextMenu';
import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { extractActions } from '@/state/util';
import { Close } from '@mui/icons-material';
import { IconButton, Stack, useTheme } from '@mui/joy';
import { Reorder } from 'framer-motion';
import { useSelector } from 'react-redux';
import { EllipsisTypography } from '../shared/EllipsisTypography';
import { PredefinedContextMenuItems } from '../shared/context/ContextMenuItems';

function useTabInfo(id: string) {
	const actions = extractActions(id);
	const item = useSelector((state) => actions?.select?.(state, id));
	if (actions == null || item == null) {
		switch (id) {
			case 'secrets':
				return { key: 'secrets', item: { id, name: 'User Secrets' } } as const;
			default:
				throw new Error(`tab type could not be determined from id ${id}`);
		}
	}
	return { key: actions.key, item };
}

interface TabProps {
	id: string;
}

export function Tab({ id }: TabProps) {
	const dispatch = useAppDispatch();
	const selected = useSelector((state) => UiSelect.isSelectedTab(state, id));
	const theme = useTheme();
	const { key, item } = useTabInfo(id);
	const onContextMenu = useContextMenu([
		{
			text: 'Close',
			items: [
				{ text: 'Close This', action: () => dispatch(UiActions.closeTab(id)) },
				{ text: 'Close Others', action: () => dispatch(UiActions.closeOtherTabs(id)) },
				PredefinedContextMenuItems.separator,
				{
					text: 'Close Left',
					action: () => dispatch(UiActions.closeTabsDirectionally({ center: id, left: true })),
				},
				{
					text: 'Close Right',
					action: () => dispatch(UiActions.closeTabsDirectionally({ center: id })),
				},
				PredefinedContextMenuItems.separator,
				{ text: 'Close All', action: () => dispatch(UiActions.clearTabs()) },
			],
		},
	]);
	return (
		<Reorder.Item
			as="div"
			value={id}
			id={id}
			style={{ width: '250px', minWidth: '200px', maxWidth: '300px', overflow: 'hidden' }}
		>
			<Stack
				onContextMenu={onContextMenu}
				direction="row"
				flexWrap="nowrap"
				alignItems="center"
				justifyContent="space-between"
				sx={{
					maxWidth: '100%',
					width: '100%',
					height: '100%',
					background: theme.palette.background.level1,
					padding: '6px',
					borderBottom: `2px solid ${selected ? theme.palette.primary.outlinedColor : theme.palette.background.level1}`,
					borderLeft: `1px solid ${theme.palette.background.level2}`,
					borderRight: `1px solid ${theme.palette.background.level2}`,
					boxSizing: 'border-box',
				}}
			>
				<Stack
					width="1px"
					gap={1}
					flex={1}
					direction="row"
					onPointerDown={(e) => e.button === 0 && dispatch(UiActions.setSelectedTab(id))}
				>
					{tabTypeIcon[key]}
					{item.name ? (
						<EllipsisTypography>{item.name}</EllipsisTypography>
					) : (
						<EllipsisTypography variant="soft" fontStyle="italic">
							Unnamed
						</EllipsisTypography>
					)}
				</Stack>
				<IconButton
					color="danger"
					onClick={(e) => {
						dispatch(UiActions.closeTab(id));
						e.stopPropagation();
					}}
					sx={{ borderRadius: '25px' }}
					size="sm"
				>
					<Close />
				</IconButton>
			</Stack>
		</Reorder.Item>
	);
}
