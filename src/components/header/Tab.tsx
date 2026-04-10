import { tabTypeIcon } from '@/constants/components';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { extractActions } from '@/state/util';
import { Close } from '@mui/icons-material';
import { IconButton, ListItemDecorator, Tab as MuiTab, Stack } from '@mui/joy';
import { useSelector } from 'react-redux';
import { EllipsisTypography } from '../shared/EllipsisTypography';
import { ContextMenu } from '../shared/context/ContextMenu';
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
	const { key, item } = useTabInfo(id);
	return (
		<ContextMenu
			items={[
				{
					text: 'Close',
					items: [
						{ text: 'Close This', action: () => dispatch(uiActions.closeTab(id)) },
						{ text: 'Close Others', action: () => dispatch(uiActions.closeOtherTabs(id)) },
						PredefinedContextMenuItems.separator,
						{
							text: 'Close Left',
							action: () => dispatch(uiActions.closeTabsDirectionally({ center: id, left: true })),
						},
						{
							text: 'Close Right',
							action: () => dispatch(uiActions.closeTabsDirectionally({ center: id })),
						},
						PredefinedContextMenuItems.separator,
						{ text: 'Close All', action: () => dispatch(uiActions.clearTabs()) },
					],
				},
			]}
		>
			<MuiTab
				component="div"
				indicatorPlacement="top"
				value={id}
				id={`tab_${id}`}
				sx={{
					minWidth: 230,
					maxWidth: 460,
					scrollSnapAlign: 'start',
				}}
			>
				<Stack direction="row" flexWrap="nowrap" alignItems="center" justifyContent="space-between" width="100%">
					<ListItemDecorator sx={{ flex: 0 }}>{tabTypeIcon[key]}</ListItemDecorator>
					<EllipsisTypography>{item.name}</EllipsisTypography>
					<ListItemDecorator sx={{ flex: 0 }}>
						<IconButton
							color="danger"
							onClick={(e) => {
								dispatch(uiActions.closeTab(id));
								e.stopPropagation();
							}}
							size="sm"
						>
							<Close />
						</IconButton>
					</ListItemDecorator>
				</Stack>
			</MuiTab>
		</ContextMenu>
	);
}
