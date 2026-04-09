import { PredefinedMenuItem } from '@tauri-apps/api/menu';
import { ContextMenuItem } from './ContextMenu';

export const ContextMenuItems = {
	duplicate: (action) => ({ action, text: 'Duplicate' }),
	delete: (action) => ({ action, text: 'Delete' }),
	collapse: (action) => ({ action, text: 'Collapse' }),
	expand: (action) => ({ action, text: 'Expand' }),
} as const satisfies Record<string, (action: () => void) => ContextMenuItem>;

export const PredefinedContextMenuItems = {
	separator: await PredefinedMenuItem.new({ item: 'Separator' }),
} as const;
