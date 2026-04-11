import { useContextMenu } from '@/hooks/useContextMenu';
import type { MenuOptions } from '@tauri-apps/api/menu';
import React from 'react';

export type ContextMenuItem = NonNullable<MenuOptions['items']>[number];

export interface ContextMenuProps extends React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
> {
	items: ContextMenuItem[];
}

export function ContextMenu({ items, ...props }: ContextMenuProps) {
	const onClick = useContextMenu(items);
	return <div {...props} onContextMenu={onClick} />;
}
