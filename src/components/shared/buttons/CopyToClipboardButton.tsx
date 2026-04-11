import { ContentCopy, DownloadDone } from '@mui/icons-material';
import type { IconButtonProps } from '@mui/joy';
import { Box, IconButton } from '@mui/joy';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { SprocketTooltip } from '../SprocketTooltip';

interface CopyToClipboardButtonProps extends PropsWithChildren, IconButtonProps {
	tooltipText?: string;
	copyText: string;
}

export function CopyToClipboardButton({
	tooltipText = 'Copy to Clipboard',
	children = <ContentCopy />,
	copyText,
	...props
}: CopyToClipboardButtonProps) {
	const [copied, setCopied] = useState(false);
	return (
		<Box component="span" position="relative">
			<SprocketTooltip text={tooltipText}>
				<IconButton
					color={copied ? 'success' : 'neutral'}
					onClick={() => {
						setCopied(true);
						setTimeout(() => {
							setCopied(false);
						}, 800);
						navigator.clipboard.writeText(copyText);
					}}
					{...props}
				>
					{copied ? <DownloadDone /> : children}
				</IconButton>
			</SprocketTooltip>
		</Box>
	);
}
