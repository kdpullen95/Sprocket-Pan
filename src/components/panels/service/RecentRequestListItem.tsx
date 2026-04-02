import { EllipsisTypography } from '@/components/shared/EllipsisTypography';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { tabTypeIcon } from '@/constants/components';
import { selectHistoryById } from '@/state/active/selectors';
import { itemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { EndpointRequest } from '@/types/data/workspace';
import { formatFullDate } from '@/utils/string';
import { Event, OpenInNew } from '@mui/icons-material';
import { IconButton, ListItem, ListItemContent, Stack, Typography } from '@mui/joy';
import { useSelector } from 'react-redux';

interface RecentRequestListItemProps {
	request: EndpointRequest;
}

export function RecentRequestListItem({ request }: RecentRequestListItemProps) {
	const history = useSelector((state) => selectHistoryById(state, request.id));
	const endpoint = useSelector((state) => itemActions.endpoint.select(state, request.endpointId));
	const dispatch = useAppDispatch();

	return (
		<>
			<ListItem>
				<ListItemContent>
					<Stack direction="row" alignItems="center" columnGap={1} rowGap={0} maxWidth="100%" flexWrap="wrap">
						<Stack direction="row" alignItems="center" gap={1}>
							{tabTypeIcon.endpoint}
							<EllipsisTypography maxWidth="250px">{endpoint?.name}</EllipsisTypography>
							{tabTypeIcon.request}
							<EllipsisTypography maxWidth="250px">{request.name}</EllipsisTypography>
						</Stack>
						<Stack direction="row" alignItems="center" gap={1}>
							<Event />
							<Typography level="title-sm" width="fit-content">
								{history.length > 0 ? formatFullDate(history[history.length - 1].timestamp ?? 0) : 'Never'}
							</Typography>
							<SprocketTooltip text="Open Request">
								<IconButton
									color="primary"
									onClick={() => {
										dispatch(uiActions.addTab(request.id));
										dispatch(uiActions.setSelectedTab(request.id));
									}}
								>
									<OpenInNew />
								</IconButton>
							</SprocketTooltip>
						</Stack>
					</Stack>
				</ListItemContent>
			</ListItem>
		</>
	);
}
