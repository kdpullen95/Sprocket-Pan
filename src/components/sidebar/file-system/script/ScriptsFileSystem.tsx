import { SearchField } from '@/components/shared/input/SearchField';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { ItemFactory } from '@/managers/data/ItemFactory';
import { selectScripts } from '@/state/active/selectors';
import { activeActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import { searchScripts } from '@/utils/search';
import { AddBox } from '@mui/icons-material';
import { IconButton, ListDivider, Stack, Typography } from '@mui/joy';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SideDrawerHeader } from '../../SideDrawerHeader';
import { FileSystemTrunk } from '../tree/FileSystemTrunk';
import { ScriptFileSystem } from './ScriptFileSystem';

export function ScriptsFileSystem() {
	const scripts = useSelector(selectScripts);
	const [searchText, setSearchText] = useState('');
	const dispatch = useAppDispatch();

	const filteredScriptIds = useMemo(() => searchScripts(scripts, searchText), [scripts, searchText]);

	return (
		<>
			<SideDrawerHeader
				content="Scripts"
				actions={
					<Stack flexWrap="wrap" direction="row" justifyContent="end" alignItems="center" gap={1}>
						<SearchField value={searchText} onChange={setSearchText} />
						<SprocketTooltip text="Add New Script">
							<IconButton onClick={() => dispatch(activeActions.insertScript(ItemFactory.script()))}>
								<AddBox />
							</IconButton>
						</SprocketTooltip>
					</Stack>
				}
			/>
			{filteredScriptIds.length === 0 && (
				<Typography textAlign="center" sx={{ width: '100%', mt: 4 }}>
					No scripts found.
				</Typography>
			)}
			<FileSystemTrunk
				items={filteredScriptIds}
				render={(id, index) => (
					<>
						{index !== 0 && <ListDivider />}
						<ScriptFileSystem scriptId={id} />
					</>
				)}
			/>
		</>
	);
}
