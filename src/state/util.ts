import { extractItemType } from '@/utils/getters';
import { ItemActions } from './items';

export function extractActions(id: string) {
	const itemType = extractItemType(id);
	if (itemType != null) {
		return { key: itemType, ...ItemActions[itemType] };
	}
}
