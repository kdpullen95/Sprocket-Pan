import { Settings } from '@mui/icons-material';
import { IconButton } from '@mui/joy';
import { JSX, useState } from 'react';
import { SprocketTooltip } from '../SprocketTooltip';
import { SprocketModal } from '../modals/SprocketModal';

export interface OpenSettingsButtonProps {
	Content: (props: { onClose: () => void }) => JSX.Element;
}

export function OpenSettingsButton({ Content }: OpenSettingsButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<>
			<SprocketTooltip text="Settings" placement="right">
				<IconButton onClick={() => setIsOpen(true)} variant="plain" color="neutral">
					<Settings />
				</IconButton>
			</SprocketTooltip>
			<SprocketModal size="lg" open={isOpen} onClose={() => setIsOpen(false)} closeOn={[]}>
				<Content onClose={() => setIsOpen(false)} />
			</SprocketModal>
		</>
	);
}
