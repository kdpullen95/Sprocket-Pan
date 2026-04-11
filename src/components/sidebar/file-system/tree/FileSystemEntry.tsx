import { ContextMenu } from '@/components/shared/context/ContextMenu';
import type { FileSystemLeafProps } from './FileSystemLeaf';

interface FileSystemEntryProps extends Omit<FileSystemLeafProps, 'color'> {
	isSelected?: boolean;
}

export function FileSystemEntry({ children, id, menuItems, isSelected = false }: FileSystemEntryProps) {
	const child = (
		<li
			id={`file_${id}`}
			style={{ display: 'flex' }}
			className={isSelected ? 'selected onHoverContainer' : 'onHoverContainer'}
		>
			{children}
		</li>
	);
	if (menuItems == null) return child;
	return <ContextMenu items={menuItems}>{child}</ContextMenu>;
}
