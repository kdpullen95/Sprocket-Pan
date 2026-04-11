import { useScrollbarTheme } from '@/hooks/useScrollbarTheme';
import { useSingleAxisScroll } from '@/hooks/useSingleAxisScroll';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { Box } from '@mui/joy';
import { AnimatePresence, Reorder } from 'framer-motion';
import { Tab } from './Tab';

interface TabRowProps {
	list: string[];
}

export function TabRow({ list }: TabRowProps) {
	const ref = useSingleAxisScroll();
	const { average: scrollbarTheme } = useScrollbarTheme();
	const dispatch = useAppDispatch();
	return (
		<Box ref={ref} sx={{ width: '100%', maxWidth: '100%', overflow: 'auto', ...scrollbarTheme }}>
			<Reorder.Group
				as="div"
				axis="x"
				onReorder={(newList) => dispatch(uiActions.reorderTabs(newList))}
				values={list}
				style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
			>
				<AnimatePresence initial={false}>
					{list.map((id) => (
						<Tab key={id} id={id} />
					))}
				</AnimatePresence>
			</Reorder.Group>
		</Box>
	);
}
