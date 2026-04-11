import { Menu, type MenuOptions } from '@tauri-apps/api/menu';
import { useMemo } from 'react';

export type ContextMenuItem = NonNullable<MenuOptions['items']>[number];

export function useContextMenu(items: ContextMenuItem[]) {
	const menuPromise = useMemo(() => Menu.new({ items }), [items]);

	return async (event: React.MouseEvent) => {
		event.preventDefault();
		const menu = await menuPromise;
		menu.popup();
	};
}
