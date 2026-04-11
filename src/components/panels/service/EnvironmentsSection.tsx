import { SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { useComputedRootEnvironment } from '@/hooks/useComputedEnvironment';
import { ItemFactory } from '@/managers/data/ItemFactory';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import type { Environment } from '@/types/data/workspace';
import { Link, LinkOff, ModeEdit, PlaylistAdd } from '@mui/icons-material';
import { Box, Divider, IconButton, Stack } from '@mui/joy';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { EnvironmentEditor } from './EnvironmentEditor';
import { LinkedEnvironmentEditor } from './LinkedEnvironmentEditor';
import type { SectionProps } from './sectionProps';

export function EnvironmentsSection({ service, onChange }: SectionProps) {
	const selectedEnvironment = useSelector(ActiveSelect.selectedServiceEnvironments)[service.id];
	const [visibleEnvId, setVisibleEnvId] = useState<string | null>(selectedEnvironment ?? null);
	const localEnvs = service.localEnvironments;
	const envList = Object.values(localEnvs);
	const visibleEnv = visibleEnvId == null ? null : service.localEnvironments[visibleEnvId];
	const dispatch = useAppDispatch();
	const selectedEnv = useSelector(ActiveSelect.selectedEnvironment);

	const envPairs = useComputedRootEnvironment().toArray();

	function addEnv(
		env: Partial<Environment> = { name: `${service.name}.env.${Object.keys(service.localEnvironments).length}` },
		nameMod?: string,
	) {
		if (nameMod != null) {
			env.name = `${env.name} ${nameMod}`;
		}
		const newEnv = ItemFactory.environment(env);
		onChange({
			localEnvironments: {
				...localEnvs,
				[newEnv.id]: newEnv,
			},
		});
		setVisibleEnvId(newEnv.id);
	}

	function deleteEnv(id: string) {
		const newData = structuredClone(localEnvs);
		delete newData[id];
		onChange({
			localEnvironments: newData,
		});
	}

	function toggleLinkedEnvMode() {
		onChange({ linkedEnvMode: !service.linkedEnvMode });
		dispatch(ActiveActions.selectEnvironment(selectedEnv));
	}

	function toggleSelectedEnv() {
		if (visibleEnvId == null || service.linkedEnvMode) {
			return;
		}
		const serviceEnvId = selectedEnvironment === visibleEnvId ? undefined : visibleEnvId;
		dispatch(ActiveActions.setSelectedServiceEnvironment({ serviceId: service.id, serviceEnvId }));
	}

	return (
		<Stack>
			<Box alignSelf="end" height={0}>
				<SprocketTooltip text={`${service.linkedEnvMode ? 'Disable' : 'Enable'} Environment Linking`}>
					<IconButton onClick={toggleLinkedEnvMode}>{service.linkedEnvMode ? <LinkOff /> : <Link />}</IconButton>
				</SprocketTooltip>
			</Box>
			<Box height={service.linkedEnvMode ? 'fit-content' : 0} sx={{ transition: 'all 1s linear', overflow: 'hidden' }}>
				<Box height="20px" />
				<LinkedEnvironmentEditor service={service} />
				<Divider sx={{ margin: '30px' }} />
			</Box>
			<Stack direction="row" gap={1} alignItems="center">
				<SprocketSelect
					startDecorator={<ModeEdit />}
					placeholder="Choose Environment"
					value={visibleEnvId ?? ''}
					onChange={setVisibleEnvId}
					options={envList.map((env) => ({ value: env.id, label: env.name }))}
				/>
				<SprocketTooltip text="Add New Service-Scoped Environment">
					<IconButton onClick={() => addEnv()}>
						<PlaylistAdd />
					</IconButton>
				</SprocketTooltip>
			</Stack>
			<Stack width="100%" minWidth="500px" flex={1}>
				{visibleEnv != null && (
					<EnvironmentEditor
						serviceId={service.id}
						env={visibleEnv}
						envPairs={envPairs}
						onChange={(values) =>
							onChange({
								localEnvironments: { ...localEnvs, [visibleEnv.id]: { ...localEnvs[visibleEnv.id], ...values } },
							})
						}
						onDelete={() => deleteEnv(visibleEnv.id)}
						onClone={(env) => addEnv(env, ' (Copy)')}
						selected={selectedEnvironment === visibleEnvId}
						toggleSelected={service.linkedEnvMode ? null : toggleSelectedEnv}
					/>
				)}
			</Stack>
		</Stack>
	);
}
