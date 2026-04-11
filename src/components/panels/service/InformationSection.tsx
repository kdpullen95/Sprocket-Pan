import { EditableText } from '@/components/shared/input/EditableText';
import { SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { SprocketTable } from '@/components/shared/SprocketTable';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import type { Service } from '@/types/data/workspace';
import { camelCaseToTitle } from '@/utils/string';
import { Link } from '@mui/icons-material';
import { Stack, Typography } from '@mui/joy';
import { useSelector } from 'react-redux';
import type { SectionProps } from './sectionProps';

const serviceDataKeys = ['version', 'baseUrl'] as const satisfies readonly (keyof Service)[];

export function InformationSection({ service, onChange }: SectionProps) {
	const selectedEnvironmentId = useSelector(ActiveSelect.selectedServiceEnvironments)[service.id];
	const activeEnv = selectedEnvironmentId == null ? null : service.localEnvironments[selectedEnvironmentId];
	const envList = Object.values(service.localEnvironments);
	const dispatch = useAppDispatch();
	const setServiceEnv = (id: string | null) =>
		dispatch(ActiveActions.setSelectedServiceEnvironment({ serviceId: service.id, serviceEnvId: id ?? undefined }));
	return (
		<SprocketTable
			borderAxis="bothBetween"
			columns={[{ key: 'title', style: { width: 175 } }, { key: 'value' }]}
			data={[
				...serviceDataKeys.map((serviceDataKey) => ({
					key: serviceDataKey,
					title: <Typography level="body-md">{camelCaseToTitle(serviceDataKey)}</Typography>,
					value: (
						<EditableText
							text={service[serviceDataKey]}
							setText={(newText: string) => onChange({ [serviceDataKey]: `${newText}` })}
							isValidFunc={(text: string) => text.length >= 1}
						/>
					),
				})),
				{
					key: 'activeEnv',
					title: <Typography level="body-md">Active Environment</Typography>,
					value: service.linkedEnvMode ? (
						<Stack direction="row" gap={1} ml="3px">
							<SprocketTooltip text="Linked Environment">
								<Link />
							</SprocketTooltip>
							<Typography>{activeEnv?.name ?? 'None'}</Typography>
						</Stack>
					) : (
						<SprocketSelect
							placeholder="None"
							value={activeEnv?.id ?? ''}
							onChange={(value) => setServiceEnv(value)}
							options={envList.map((env) => ({ value: env.id, label: env.name }))}
						/>
					),
				},
			]}
		/>
	);
}
