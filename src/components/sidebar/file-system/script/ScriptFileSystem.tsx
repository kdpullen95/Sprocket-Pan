import { FluentCodeSvg } from '@/assets/icons/fluent/FluentCode';
import { FluentLinkSvg } from '@/assets/icons/fluent/FluentLink';
import { ContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { useShowSync } from '@/hooks/useShowSync';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import { useSelector } from 'react-redux';
import { EllipsesP } from '../components/EllipsesP';
import { FileSystemLeaf } from '../tree/FileSystemLeaf';

interface ScriptFileSystemProps {
	scriptId: string;
}

export function ScriptFileSystem({ scriptId }: ScriptFileSystemProps) {
	const script = useSelector((state) => ItemActions.script.select(state, scriptId));
	const dispatch = useAppDispatch();
	const showSync = useShowSync(scriptId);
	if (script == null) {
		console.warn("the deletion bug hasn't been fixed yet");
		return <></>;
	}
	return (
		<FileSystemLeaf
			id={scriptId}
			menuItems={[
				ContextMenuItems.duplicate(() => dispatch(ItemActions.script.duplicate(script))),
				ContextMenuItems.delete(() => dispatch(UiActions.addToDeleteQueue(script.id))),
			]}
		>
			<div style={{ flex: 0 }}>{showSync ? <FluentLinkSvg /> : <FluentCodeSvg />}</div>
			<EllipsesP>{script.name}</EllipsesP>
		</FileSystemLeaf>
	);
}
