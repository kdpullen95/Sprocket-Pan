import { useScrollbarTheme } from '@/hooks/useScrollbarTheme';
import { useSingleAxisScroll } from '@/hooks/useSingleAxisScroll';
import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { Box } from '@mui/joy';
import { AnimatePresence, Reorder } from 'framer-motion';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Tab } from './Tab';

export function HeaderTabRow() {
	const selectedTab = useSelector(UiSelect.selectedTab);
	const list = useSelector(UiSelect.tabs);
	const ref = useSingleAxisScroll();
	const { average: scrollbarTheme } = useScrollbarTheme();
	const dispatch = useAppDispatch();
	useEffect(() => {
		if (selectedTab) {
			// TODO: this isn't the react way to do this
			document.getElementById(`tab_${selectedTab}`)?.scrollIntoView();
			const fileToScrollTo = document.getElementById(`file_${selectedTab}`);
			fileToScrollTo?.scrollIntoView({ block: 'center' });
		}
	}, [selectedTab]);
	return (
		<Box ref={ref} sx={{ width: '100%', maxWidth: '100%', overflow: 'auto', ...scrollbarTheme }}>
			<Reorder.Group
				as="div"
				axis="x"
				onReorder={(newList) => dispatch(UiActions.reorderTabs(newList))}
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
