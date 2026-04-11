import type { Item } from '@/types/data/item';

interface InlineItemNameProps {
	item?: Item | null;
	maxLength?: number;
}

export function InlineItemName({ item, maxLength = 20 }: InlineItemNameProps) {
	if (item == null) return <></>;
	const length = item.name.length ?? 0;
	const name = length > maxLength ? `${item.name.slice(0, maxLength)}...` : item.name;
	return <span style={{ textDecoration: 'underline' }}>{name}</span>;
}
