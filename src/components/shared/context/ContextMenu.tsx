import { Menu, MenuOptions } from '@tauri-apps/api/menu';
import React, { PropsWithChildren, useMemo } from 'react';

export type ContextMenuItem = NonNullable<MenuOptions['items']>[number];

export interface ContextMenuProps extends PropsWithChildren {
	items: ContextMenuItem[];
}

export function ContextMenu({ children, items }: ContextMenuProps) {
	const menuPromise = useMemo(() => Menu.new({ items }), [items]);

	async function onClick(event: React.MouseEvent) {
		event.preventDefault();
		const menu = await menuPromise;
		menu.popup();
	}

	return <div onContextMenu={onClick}>{children}</div>;
}
