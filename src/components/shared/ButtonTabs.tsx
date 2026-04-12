import { useScrollbarTheme } from '@/hooks/useScrollbarTheme';
import { useSingleAxisScroll } from '@/hooks/useSingleAxisScroll';
import type { ColorPaletteProp } from '@mui/joy';
import { Button, Stack, useTheme } from '@mui/joy';
import type { ReactNode } from 'react';
import { useState } from 'react';

interface Tab {
	title: string;
	icon?: ReactNode;
	color?: ColorPaletteProp;
}

interface ButtonTabsProps {
	tabs: Tab[];
	onChange?: (index: number, oldIndex: number) => void;
}

export function ButtonTabs({ tabs, onChange }: ButtonTabsProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const { minimal: scrollbarTheme } = useScrollbarTheme();
	const theme = useTheme();
	const ref = useSingleAxisScroll();
	const switchTab = (index: number) => {
		if (index === activeIndex) {
			//if only two, toggle between them. if more, out of luck
			if (tabs.length === 2) {
				const newIndex = activeIndex ? 0 : 1;
				onChange?.(newIndex, activeIndex);
				setActiveIndex(newIndex);
			}
		} else {
			onChange?.(index, activeIndex);
			setActiveIndex(index);
		}
	};
	return (
		<Stack
			ref={ref}
			direction="row"
			sx={{
				...scrollbarTheme,
				overflow: 'auto',
				maxWidth: '100%',
			}}
		>
			{tabs.map(({ title, icon, color }, index) => (
				<Button
					key={title}
					sx={{
						clipPath: index === 0 ? '' : 'polygon(30px 0, 100% 0, 100% 100%, 0 100%)',
						ml: index === 0 ? 0 : '-30px',
						height: '30px',
						minWidth: '150px',
						maxWidth: '250px',
						width: '100%',
						borderRadius: 0,
						fontWeight: 400,
						borderBottom: `2px solid ${activeIndex === index ? theme.palette.divider : 'none'}`,
					}}
					variant="soft"
					startDecorator={icon}
					color={activeIndex === index ? (color ?? 'primary') : 'neutral'}
					onClick={() => switchTab(index)}
				>
					{title}
				</Button>
			))}
		</Stack>
	);
}
