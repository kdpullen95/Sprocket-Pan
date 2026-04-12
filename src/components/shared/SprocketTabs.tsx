import { Box, Stack } from '@mui/joy';
import type { SxProps } from '@mui/joy/styles/types';
import { useState } from 'react';
import { ButtonTabs } from './ButtonTabs';

interface SprocketTab {
	content: React.ReactNode;
	title: string;
}

interface SprocketTabsProps {
	tabs: SprocketTab[];
	sx?: SxProps;
}

export function SprocketTabs({ tabs, sx }: SprocketTabsProps) {
	const [tab, setTab] = useState(tabs.at(0)?.title);
	return (
		<Stack sx={sx} gap={1} maxWidth="100%">
			<ButtonTabs tabs={tabs} onChange={(index) => setTab(tabs[index].title)} />
			{tabs.map(({ title, content }) => (
				<Box sx={{ display: title === tab ? 'block' : 'none' }} key={title}>
					{content}
				</Box>
			))}
		</Stack>
	);
}
