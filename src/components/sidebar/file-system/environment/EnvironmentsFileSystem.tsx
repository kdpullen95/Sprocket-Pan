import { SearchField } from '@/components/shared/input/SearchField';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { selectEnvironments } from '@/state/active/selectors';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { ItemType } from '@/types/data/item';
import { searchEnvironments } from '@/utils/search';
import { AddBox } from '@mui/icons-material';
import { IconButton, ListDivider, Stack, Typography } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { OpenSecretsButton } from '../../buttons/OpenSecretsButton';
import { SideDrawerHeader } from '../../SideDrawerHeader';
import { FileSystemTrunk } from '../tree/FileSystemTrunk';
import { EnvironmentFileSystem } from './EnvironmentFileSystem';

export function EnvironmentsFileSystem() {
	const environments = useSelector(selectEnvironments);
	const [searchText, setSearchText] = useState('');
	const dispatch = useAppDispatch();

	const filteredEnvironmentIds = useMemo(
		() => searchEnvironments(environments, searchText),
		[environments, searchText],
	);

	return (
		<>
			<SideDrawerHeader
				content="Environments"
				actions={
					<Stack flexWrap="wrap" direction="row" justifyContent="end" alignItems="center" gap={1}>
						<SearchField value={searchText} onChange={setSearchText} />
						<Stack direction="row">
							<OpenSecretsButton />
							<SprocketTooltip text="Add New Environment">
								<IconButton onClick={() => dispatch(uiActions.addToCreateQueue(ItemType.environment))}>
									<AddBox />
								</IconButton>
							</SprocketTooltip>
						</Stack>
					</Stack>
				}
			/>
			{filteredEnvironmentIds.length === 0 && (
				<Typography textAlign="center" sx={{ width: '100%', mt: 4 }}>
					No environments found.
				</Typography>
			)}
			<FileSystemTrunk
				items={filteredEnvironmentIds}
				render={(id, index) => (
					<>
						{index !== 0 && <ListDivider />}
						<EnvironmentFileSystem environmentId={id} />
					</>
				)}
			/>
		</>
	);
}
