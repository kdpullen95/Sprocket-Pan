import { ActiveSelect } from '@/state/active/selectors';
import { useSelector } from 'react-redux';

export function useShowSync(id: string) {
	const sync = useSelector(ActiveSelect.syncMetadata);
	const settings = useSelector(ActiveSelect.settings);
	return settings.data.sync.enabled && !!sync.items[id];
}
