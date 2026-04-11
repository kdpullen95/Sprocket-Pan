import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { CollapseExpandButton } from '@/components/sidebar/buttons/CollapseExpandButton';
import { tabTypeIcon } from '@/constants/components';
import { AuditLogManager } from '@/managers/AuditLogManager';
import { ActiveSelect } from '@/state/active/selectors';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import type { AuditLog, TransformedAuditLog } from '@/types/data/audit';
import { camelCaseToTitle, formatMilliseconds } from '@/utils/string';
import {
	Anchor,
	ArrowDropDown,
	ArrowDropUp,
	Code,
	Launch,
	SelfImprovement,
	Send,
	Timer,
	WhereToVote,
} from '@mui/icons-material';
import {
	Badge,
	Box,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemContent,
	ListItemDecorator,
	Stack,
	Typography,
} from '@mui/joy';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const indentationSize = 20;

const eventStrIconsMap = {
	Service: (
		<>
			{tabTypeIcon.service}
			<Code />
		</>
	),
	Endpoint: (
		<>
			{tabTypeIcon.endpoint}
			<Code />
		</>
	),
	Request: (
		<>
			{tabTypeIcon.request}
			<Code />
		</>
	),
	request: (
		<>
			{tabTypeIcon.request}
			<Send />
		</>
	),
	root: <Anchor />,
	standaloneScript: (
		<>
			<SelfImprovement />
			{tabTypeIcon.script}
		</>
	),
};

interface VisualEventLogInnerProps {
	transformedLog: TransformedAuditLog;
	requestId: string;
	indentation: number;
}

function VisualEventLogInner({ transformedLog, requestId, indentation }: VisualEventLogInnerProps) {
	const { requests, environments, services, endpoints, scripts } = useSelector(ActiveSelect.allItems);
	const data = { requests, environments, services, endpoints, scripts };
	const dispatch = useAppDispatch();
	const [collapsed, setCollapsed] = useState(false);
	const requestEvent = transformedLog.before;
	const icons = (
		<>
			{requestEvent.eventType.includes('pre') && <ArrowDropUp />}
			{requestEvent.eventType.includes('post') && <ArrowDropDown />}
			{
				eventStrIconsMap[
					(Object.keys(eventStrIconsMap).find((event) => requestEvent.eventType.includes(event)) ??
						'request') as keyof typeof eventStrIconsMap
				]
			}
		</>
	);
	const dataType = requestEvent.eventType === 'root' ? null : AuditLogManager.getEventDataType(requestEvent);
	const associatedItem = dataType && requestEvent.associatedId ? data[`${dataType}s`][requestEvent.associatedId] : null;
	return (
		<>
			<Box sx={{ pl: `${indentation}px` }}>
				<ListItemDecorator>
					<Box sx={{ mr: '5px' }}>{icons}</Box>
					{requestEvent.eventType === 'request' &&
						requestEvent.associatedId &&
						requests[requestEvent.associatedId].name}{' '}
					{camelCaseToTitle(requestEvent.eventType)}
					{transformedLog.innerEvents.length > 0 && (
						<CollapseExpandButton collapsed={collapsed} toggleCollapsed={() => setCollapsed(!collapsed)} />
					)}
				</ListItemDecorator>
				<ListItemButton>
					<ListItemContent>
						<Typography level="title-sm"></Typography>
						<Typography level="body-sm">
							<Stack direction="row" alignItems="center" gap={1}>
								<Timer />
								{formatMilliseconds(transformedLog.after.timestamp - transformedLog.before.timestamp)}
							</Stack>
							{dataType && requestEvent.associatedId && (
								<Stack direction="row" alignItems="center" gap={1}>
									<Badge />
									{associatedItem?.name ?? 'Unknown'} {camelCaseToTitle(dataType)}
									{requestEvent.associatedId != requestId ? (
										<SprocketTooltip text={`Open ${associatedItem?.name ?? 'Unknown'} ${camelCaseToTitle(dataType)}`}>
											<IconButton
												size="sm"
												color="primary"
												disabled={associatedItem == null}
												onClick={() => {
													if (associatedItem != null) {
														const id = requestEvent.associatedId as string;
														dispatch(UiActions.addTab(id));
														dispatch(UiActions.setSelectedTab(id));
													}
												}}
											>
												<Launch />
											</IconButton>
										</SprocketTooltip>
									) : (
										<SprocketTooltip
											text={
												requestEvent.eventType === 'request'
													? 'This is the current request'
													: `This is the ${camelCaseToTitle(
															requestEvent.eventType,
														).toLocaleLowerCase()} for this request`
											}
										>
											<WhereToVote color="success" />
										</SprocketTooltip>
									)}
								</Stack>
							)}
						</Typography>
					</ListItemContent>
				</ListItemButton>
			</Box>
			{transformedLog.innerEvents.length > 0 && !collapsed && (
				<ListItem nested sx={{ '--List-nestedInsetStart': '10rem' }}>
					{transformedLog.innerEvents.map((event, index) => (
						<Box key={index}>
							<Divider sx={{ my: '10px' }} />
							<VisualEventLogInner
								transformedLog={event}
								requestId={requestId}
								indentation={indentation + indentationSize}
							/>
						</Box>
					))}
				</ListItem>
			)}
		</>
	);
}

export function VisualEventLog(props: { auditLog: AuditLog; requestId: string }) {
	const transformedLog = AuditLogManager.transformAuditLog(props.auditLog);
	return (
		<List sx={{ '--List-nestedInsetStart': '10rem' }}>
			{transformedLog && (
				<VisualEventLogInner transformedLog={transformedLog} requestId={props.requestId} indentation={0} />
			)}
		</List>
	);
}
