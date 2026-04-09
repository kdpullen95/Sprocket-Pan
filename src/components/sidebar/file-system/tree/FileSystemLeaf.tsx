import { ContextMenuItem } from '@/components/shared/context/ContextMenu';
import { useAppDispatch } from '@/state/store';
import { selectIsActiveTab } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { FileSystemEntry } from './FileSystemEntry';

export interface FileSystemLeafProps extends PropsWithChildren {
	id: string;
	menuItems?: ContextMenuItem[];
	color?: string;
}

export function FileSystemLeaf({ id, menuItems, children, color }: FileSystemLeafProps) {
	const dispatch = useAppDispatch();
	const isSelected = useSelector((state) => selectIsActiveTab(state, id));
	return (
		<FileSystemEntry id={id} menuItems={menuItems} isSelected={isSelected}>
			<button
				style={{ gap: '7px', display: 'flex', alignItems: 'center', flex: 1, minWidth: '50px', color }}
				onClick={() => {
					dispatch(uiActions.addTab(id));
					dispatch(uiActions.setSelectedTab(id));
				}}
			>
				{children}
			</button>
		</FileSystemEntry>
	);
}
