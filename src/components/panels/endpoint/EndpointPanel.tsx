import { SyncButton } from '@/components/shared/buttons/SyncButton';
import { EnvironmentTypography } from '@/components/shared/EnvironmentTypography';
import { useComputedServiceEnvironment } from '@/hooks/useComputedEnvironment';
import { useDebounce } from '@/hooks/useDebounce';
import { EnvironmentContextResolver } from '@/managers/EnvironmentContextResolver';
import { ActiveActions } from '@/state/active/slice';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import type { Endpoint } from '@/types/data/workspace';
import { ExitToApp } from '@mui/icons-material';
import { Button, Input, Stack } from '@mui/joy';
import { useSelector } from 'react-redux';
import type { PanelProps } from '../panels.interface';
import { EditableHeader } from '../shared/EditableHeader';
import { VerbSelect } from '../shared/VerbSelect';
import { EndpointEditTabs } from './EndpointEditTabs';

export function EndpointPanel({ id }: PanelProps) {
	const dispatch = useAppDispatch();
	const endpoint = useSelector((state) => ItemActions.endpoint.select(state, id));
	const service = useSelector((state) => ItemActions.service.select(state, endpoint?.serviceId));

	const computedEnv = useComputedServiceEnvironment(endpoint?.serviceId);
	const envSnippets = EnvironmentContextResolver.stringWithVarsToSnippet(service?.baseUrl || 'unknown', computedEnv);

	const update = (values: Partial<Endpoint>) => {
		dispatch(ActiveActions.updateEndpoint({ ...values, id }));
	};

	const [localDataState, setLocalDataState] = useDebounce({
		state: endpoint?.url ?? '',
		setState: (newUrl: string) => update({ url: newUrl }),
	});

	if (endpoint == null || service == null) {
		return <>Endpoint data not found</>;
	}

	return (
		<Stack gap={2} p={2}>
			<EditableHeader value={endpoint.name} onChange={(name) => update({ name })} right={<SyncButton id={id} />} />
			<Stack direction="row" gap={2}>
				<VerbSelect value={endpoint.verb} onChange={(verb) => update({ verb })} />
				<Input
					sx={{ flexGrow: 1 }}
					startDecorator={
						<EnvironmentTypography typographyProps={{ variant: 'outlined', color: 'primary' }} snippets={envSnippets} />
					}
					value={localDataState}
					onChange={(e) => {
						setLocalDataState(e.target.value);
					}}
					color="primary"
				/>
				<Button
					sx={{ minWidth: 150 }}
					color="primary"
					startDecorator={<ExitToApp />}
					disabled={!endpoint.defaultRequest}
					onClick={() => {
						if (endpoint.defaultRequest) {
							dispatch(UiActions.addTab(endpoint.defaultRequest));
							dispatch(UiActions.setSelectedTab(endpoint.defaultRequest));
						}
					}}
				>
					Jump to Request
				</Button>
			</Stack>
			<EndpointEditTabs endpoint={endpoint} />
		</Stack>
	);
}
