import { Box } from '@mui/joy';
import { open } from '@tauri-apps/plugin-shell';
import type { PropsWithChildren } from 'react';

interface AProps extends PropsWithChildren {
	href: string;
}

export function A({ href, children }: AProps) {
	return (
		<Box component="span" sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => open(href)}>
			{children}
		</Box>
	);
}
