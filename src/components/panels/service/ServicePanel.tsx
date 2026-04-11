import { SyncButton } from '@/components/shared/buttons/SyncButton';
import { SprocketTabs } from '@/components/shared/SprocketTabs';
import { ActiveActions } from '@/state/active/slice';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import type { Service } from '@/types/data/workspace';
import { AccordionGroup, Stack } from '@mui/joy';
import { useSelector } from 'react-redux';
import type { PanelProps } from '../panels.interface';
import { EditableHeader } from '../shared/EditableHeader';
import { PrePostScriptDisplay } from '../shared/PrePostScriptDisplay';
import { EnvironmentsSection } from './EnvironmentsSection';
import { GeneralSection } from './GeneralSection';

export function ServicePanel({ id }: PanelProps) {
	const dispatch = useAppDispatch();
	const service = useSelector((state) => ItemActions.service.select(state, id));

	function update(values: Partial<Service>) {
		dispatch(ActiveActions.updateService({ ...values, id }));
	}

	if (service == null) {
		throw new Error(`Service Panel could not find associated Service, id ${id}`);
	}

	return (
		<Stack gap={2} p={2}>
			<EditableHeader value={service.name} onChange={(name) => update({ name })} right={<SyncButton id={id} />} />
			<SprocketTabs
				tabs={[
					{
						title: 'General',
						content: <GeneralSection service={service} onChange={update} />,
					},
					{
						title: 'Environments',
						content: <EnvironmentsSection service={service} onChange={update} />,
					},
					{
						title: 'Scripts',
						content: (
							<AccordionGroup transition="0.2s ease">
								<PrePostScriptDisplay
									onChange={update}
									preRequestScript={service.preRequestScript}
									postRequestScript={service.postRequestScript}
								/>
							</AccordionGroup>
						),
					},
				]}
			/>
		</Stack>
	);
}
