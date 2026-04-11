import type { RootEnvironment } from '@/types/data/workspace';
import { Badge } from '@mui/joy';
import type { PropsWithChildren } from 'react';

interface EnvironmentBadgeProps extends PropsWithChildren {
	environment: Pick<RootEnvironment, 'badge' | 'name'> | null;
}

export function EnvironmentBadge({ environment, children }: EnvironmentBadgeProps) {
	// TODO: better first-letter grabbing
	const badge = environment != null && environment.badge == null ? { prefix: environment.name.at(0) } : null;
	if (badge == null) return children;
	return (
		<Badge
			size="sm"
			badgeInset="14%"
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			badgeContent={badge?.prefix}
		>
			{children}
		</Badge>
	);
}
