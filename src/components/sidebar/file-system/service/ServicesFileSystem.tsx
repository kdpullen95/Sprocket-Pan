import { SearchField } from '@/components/shared/input/SearchField';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { ItemFactory } from '@/managers/data/ItemFactory';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { UiThunks } from '@/state/ui/thunks';
import { AddBox } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/joy';
import { useSelector } from 'react-redux';
import { SideDrawerHeader } from '../../SideDrawerHeader';
import { menuOptionCollapseAll, menuOptionExpandAll } from '../tree/FileSystemDropdown';
import { FileSystemTrunk } from '../tree/FileSystemTrunk';
import { ServiceFileSystem } from './ServiceFileSystem';

export function ServicesFileSystem() {
	const searchText = useSelector(UiSelect.searchText);
	const services = useSelector(ActiveSelect.services);
	const serviceIdsUnfiltered = Object.values(services).map((srv) => srv.id);
	const serviceIds = useSelector((state) => UiSelect.filteredNestedIds(state, serviceIdsUnfiltered));
	const dispatch = useAppDispatch();

	return (
		<>
			<SideDrawerHeader
				content="Services"
				menuOptions={[
					menuOptionCollapseAll(() => dispatch(UiThunks.collapseAll(Object.keys(services))), 'Services'),
					menuOptionExpandAll(() => dispatch(UiThunks.expandAll(Object.keys(services))), 'Services'),
				]}
				actions={
					<Stack flexWrap="wrap" direction="row" justifyContent="end" alignItems="center" gap={1}>
						<SearchField value={searchText} onChange={(text) => dispatch(UiActions.setSearchText(text))} />
						<SprocketTooltip text="Add New Service">
							<IconButton onClick={() => dispatch(ActiveActions.insertService(ItemFactory.service()))}>
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
