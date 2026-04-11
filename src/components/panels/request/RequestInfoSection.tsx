import { FluentSelectAllOff } from '@/assets/icons/fluent/FluentSelectAllOff';
import { FluentSelectAllOn } from '@/assets/icons/fluent/FluentSelectAllOn';
import { CopyToClipboardButton } from '@/components/shared/buttons/CopyToClipboardButton';
import { SyncButton } from '@/components/shared/buttons/SyncButton';
import { EnvironmentTypography } from '@/components/shared/EnvironmentTypography';
import { SprocketTable } from '@/components/shared/SprocketTable';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import type { Endpoint, EndpointRequest } from '@/types/data/workspace';
import { Edit, Fingerprint } from '@mui/icons-material';
import { Card, IconButton, Stack, Typography } from '@mui/joy';
import { useSelector } from 'react-redux';
import { VerbSelect } from '../shared/VerbSelect';

export interface RequestInfoSectionProps {
	request: EndpointRequest;
}

export function RequestInfoSection({ request }: RequestInfoSectionProps) {
	const dispatch = useAppDispatch();
	const endpoint = useSelector((state) => ItemActions.endpoint.select(state, request.endpointId));
	const envSnippets = useSelector((state) => ActiveSelect.environmentSnippets(state, request.id));

	if (endpoint == null) {
		throw new Error('endpoint is null in the requestInfoSection');
	}

	const isDefault = endpoint.defaultRequest === request.id;
	function updateAssociatedEndpoint(values: Partial<Endpoint>) {
		dispatch(ActiveActions.updateEndpoint({ ...values, id: request.endpointId }));
	}

	return (
		<Stack gap={2} sx={{ overflowX: 'hidden' }}>
			<Stack direction="row" gap={2} width="100%" alignItems="center" justifyContent="space-between">
				<VerbSelect value={endpoint.verb} open={false} />
				<Stack direction="row" gap={1}>
					<SprocketTooltip text={isDefault ? 'Unset as Default Request' : 'Set As Default Request'}>
						<IconButton
							color={isDefault ? 'primary' : 'neutral'}
							variant="soft"
							onClick={() =>
								updateAssociatedEndpoint({
									defaultRequest: isDefault ? null : request.id,
								})
							}
						>
							{isDefault ? <FluentSelectAllOn /> : <FluentSelectAllOff />}
						</IconButton>
					</SprocketTooltip>
					<SyncButton placement="bottom" variant="soft" id={request.id} />

					<SprocketTooltip text="Edit Parent Endpoint">
						<IconButton
							variant="outlined"
							color="primary"
							onClick={() => {
								dispatch(UiActions.addTab(request.endpointId));
								dispatch(UiActions.setSelectedTab(request.endpointId));
							}}
						>
							<Edit />
						</IconButton>
					</SprocketTooltip>
				</Stack>
			</Stack>
			<Card
				variant="outlined"
				color="primary"
				sx={{
					'--Card-padding': '6px',
					overflowWrap: 'anywhere',
					wordBreak: 'break-all',
					flexGrow: 1,
				}}
			>
				<EnvironmentTypography snippets={envSnippets} />
			</Card>
			<SprocketTable
				columns={[{ key: 'title', style: { width: 200 } }, { key: 'value' }]}
				data={[
					{
						key: 'id',
						title: 'SprocketPan Request ID',
						value: (
							<Typography
								startDecorator={
									<CopyToClipboardButton tooltipText="Copy Request ID" copyText={request.id}>
										<Fingerprint />
									</CopyToClipboardButton>
								}
							>
								{request.id}
							</Typography>
						),
					},
				]}
			/>
		</Stack>
	);
}
