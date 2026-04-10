import { FluentCodeSvg } from '@/assets/icons/fluent/FluentCode';
import { FluentLinkSvg } from '@/assets/icons/fluent/FluentLink';
import { ContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { useShowSync } from '@/hooks/useShowSync';
import { itemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { useSelector } from 'react-redux';
import { EllipsesP } from '../components/EllipsesP';
import { FileSystemLeaf } from '../tree/FileSystemLeaf';

interface ScriptFileSystemProps {
	scriptId: string;
}

export function ScriptFileSystem({ scriptId }: ScriptFileSystemProps) {
	const script = useSelector((state) => itemActions.script.select(state, scriptId));
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
				ContextMenuItems.duplicate(() => dispatch(itemActions.script.duplicate(script))),
				ContextMenuItems.delete(() => dispatch(uiActions.addToDeleteQueue(script.id))),
			]}
		>
			<div style={{ flex: 0 }}>{showSync ? <FluentLinkSvg /> : <FluentCodeSvg />}</div>
			<EllipsesP>{script.name}</EllipsesP>
		</FileSystemLeaf>
	);
}
