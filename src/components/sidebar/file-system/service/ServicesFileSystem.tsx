import { SearchField } from '@/components/shared/input/SearchField';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { selectServices } from '@/state/active/selectors';
import { useAppDispatch } from '@/state/store';
import { selectFilteredNestedIds, selectSearchText } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { collapseAll, expandAll } from '@/state/ui/thunks';
import { ItemType } from '@/types/data/item';
import { AddBox } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/joy';
import { useSelector } from 'react-redux';
import { SideDrawerHeader } from '../../SideDrawerHeader';
import { menuOptionCollapseAll, menuOptionExpandAll } from '../tree/FileSystemDropdown';
import { FileSystemTrunk } from '../tree/FileSystemTrunk';
import { ServiceFileSystem } from './ServiceFileSystem';

export function ServicesFileSystem() {
	const searchText = useSelector(selectSearchText);
	const services = useSelector(selectServices);
	const serviceIdsUnfiltered = Object.values(services).map((srv) => srv.id);
	const serviceIds = useSelector((state) => selectFilteredNestedIds(state, serviceIdsUnfiltered));
	const dispatch = useAppDispatch();

	return (
		<>
			<SideDrawerHeader
				content="Services"
				menuOptions={[
					menuOptionCollapseAll(() => dispatch(collapseAll(Object.keys(services))), 'Services'),
					menuOptionExpandAll(() => dispatch(expandAll(Object.keys(services))), 'Services'),
				]}
				actions={
					<Stack flexWrap="wrap" direction="row" justifyContent="end" alignItems="center" gap={1}>
						<SearchField value={searchText} onChange={(text) => dispatch(uiActions.setSearchText(text))} />
						<SprocketTooltip text="Add New Service">
							<IconButton onClick={() => dispatch(uiActions.addToCreateQueue(ItemType.service))}>
								<AddBox />
							</IconButton>
						</SprocketTooltip>
					</Stack>
				}
			/>
			{serviceIds.length === 0 && (
				<Typography textAlign="center" sx={{ width: '100%', mt: 4 }}>
					No services found.
				</Typography>
			)}
			<FileSystemTrunk items={serviceIds} render={(id) => <ServiceFileSystem serviceId={id} />} />
		</>
	);
}
