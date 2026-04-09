import { EllipsisTypography } from '@/components/shared/EllipsisTypography';
import { SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { selectEnvironments } from '@/state/active/selectors';
import { activeActions } from '@/state/active/slice';
import { Service } from '@/types/data/workspace';
import { Link } from '@mui/icons-material';
import { Stack } from '@mui/joy';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface LinkedEnvironmentEditorProps {
	service: Service;
}

export function LinkedEnvironmentEditor({ service }: LinkedEnvironmentEditorProps) {
	const environments = useSelector(selectEnvironments);
	const dispatch = useDispatch();
	const envList = useMemo(
		() =>
			Object.values(environments).map((env) => ({ name: env.name, id: env.id, linkedEnv: env.linked?.[service.id] })),
		[environments, service],
	);
	return (
		<Stack gap={2}>
			{envList.map((env) => (
				<Stack key={env.id} gap={1}>
					<EllipsisTypography>{env.name}</EllipsisTypography>
					<SprocketSelect
						startDecorator={<Link />}
						placeholder="None"
						value={env.linkedEnv ?? ''}
						onChange={(value) =>
							value == null
								? dispatch(activeActions.removeLinkedEnv({ serviceId: service.id, envId: env.id }))
								: dispatch(activeActions.addLinkedEnv({ serviceEnvId: value, serviceId: service.id, envId: env.id }))
						}
						options={Object.values(service.localEnvironments).map((env) => ({ value: env.id, label: env.name }))}
					/>
				</Stack>
			))}
		</Stack>
	);
}
