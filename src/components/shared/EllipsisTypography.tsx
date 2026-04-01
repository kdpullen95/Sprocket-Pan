import { Box, Typography } from '@mui/joy';
import { TypographyProps } from '@mui/joy/Typography/TypographyProps';
import { PropsWithChildren } from 'react';

export function EllipsisSpan({ children }: PropsWithChildren) {
	return (
		<Box
			component="span"
			sx={{
				maxWidth: '100%',
				width: '100%',
				textOverflow: 'ellipsis',
				textWrap: 'nowrap',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
			}}
		>
			{children}
		</Box>
	);
}

export function EllipsisTypography({ sx, children, ...props }: TypographyProps) {
	return (
		<Typography
			maxWidth="100%"
			width="fit-content"
			{...props}
			sx={{
				textOverflow: 'ellipsis',
				textWrap: 'nowrap',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				...sx,
			}}
		>
			{children}
		</Typography>
	);
}
