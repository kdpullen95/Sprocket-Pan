import { selectUiMetadataById } from '@/state/active/selectors';
import { useAppDispatch } from '@/state/store';
import { selectIsActiveTab } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { useSelector } from 'react-redux';
import { CollapsibleFolder } from '../components/CollapsibleFolder';
import { FileSystemEntry } from './FileSystemEntry';
import { FileSystemLeafProps } from './FileSystemLeaf';

interface FileSystemBranchProps extends FileSystemLeafProps {
	buttonContent: React.ReactNode;
}

export function FileSystemBranch({ buttonContent, children, menuItems, id }: FileSystemBranchProps) {
	const dispatch = useAppDispatch();
	const collapsed = useSelector((state) => selectUiMetadataById(state, id))?.collapsed ?? false;
	const isSelected = useSelector((state) => selectIsActiveTab(state, id));
	return (
		<>
			<FileSystemEntry id={id} menuItems={menuItems} isSelected={isSelected}>
				<CollapsibleFolder collapsed={collapsed} id={id} />
				<button
					style={{ gap: '7px', display: 'flex', alignItems: 'center', flex: 1, minWidth: '50px' }}
					onClick={() => {
						dispatch(uiActions.addTab(id));
						dispatch(uiActions.setSelectedTab(id));
					}}
				>
					{buttonContent}
				</button>
			</FileSystemEntry>
			{!collapsed && <ul>{children}</ul>}
		</>
	);
}
