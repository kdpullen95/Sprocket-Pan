import { EditableData } from '@/components/shared/input/monaco/EditableData';
import { SprocketTabs } from '@/components/shared/SprocketTabs';
import { useComputedRequestEnvironment } from '@/hooks/useComputedEnvironment';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import type { EndpointRequest } from '@/types/data/workspace';
import { PrePostScriptDisplay } from '../shared/PrePostScriptDisplay';
import { RequestBody } from './RequestBody';
import type { RequestInfoSectionProps } from './RequestInfoSection';
import { RequestInfoSection } from './RequestInfoSection';

export function RequestEditTabs({ request }: RequestInfoSectionProps) {
	const envPairs = useComputedRequestEnvironment(request.id).toArray();
	const dispatch = useAppDispatch();
	function update(values: Partial<EndpointRequest>) {
		dispatch(ActiveActions.updateRequest({ ...values, id: request.id }));
	}

	return (
		<SprocketTabs
			sx={{ height: '100%' }}
			tabs={[
				{
					title: 'Info',
					content: <RequestInfoSection request={request} />,
				},
				{ title: 'Body', content: <RequestBody request={request} /> },
				{
					title: 'Headers',
					content: (
						<EditableData
							initialValues={request.headers}
							onChange={(values) => update({ headers: values })}
							envPairs={envPairs}
						/>
					),
				},
				{
					title: 'Query Params',
					content: (
						<EditableData
							initialValues={request.queryParams}
							onChange={(queryParams) => update({ queryParams })}
							envPairs={envPairs}
						/>
					),
				},
				{
					title: 'Scripts',
					content: (
						<PrePostScriptDisplay
							onChange={update}
							preRequestScript={request.preRequestScript}
							postRequestScript={request.postRequestScript}
						/>
					),
				},
				{
					title: 'Environment',
					content: (
						<EditableData
							initialValues={request.environmentOverride?.pairs ?? []}
							onChange={(pairs) => update({ environmentOverride: { ...request.environmentOverride, pairs } })}
							envPairs={envPairs}
						/>
					),
				},
			]}
		/>
	);
}
