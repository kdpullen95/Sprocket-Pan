import { EnvironmentBadge } from '@/components/shared/EnvironmentBadge';
import { RootEnvironment } from '@/types/data/workspace';
import { Style } from '@mui/icons-material';
import { IconButton } from '@mui/joy';

interface EditEnvironmentBadgeProps {
	onChange: (val: RootEnvironment['badge']) => void;
	environment: Pick<RootEnvironment, 'badge' | 'name'>;
}

export function EditEnvironmentBadge({ onChange, environment }: EditEnvironmentBadgeProps) {
	return (
		<IconButton>
			<EnvironmentBadge environment={environment}>
				<Style />
			</EnvironmentBadge>
		</IconButton>
	);
}
