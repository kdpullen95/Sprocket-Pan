import { FluentCubeSvg } from '@/assets/icons/fluent/FluentCube';
import { FluentCubeLinkSvg } from '@/assets/icons/fluent/FluentCubeLink';
import { ContextMenuItems, PredefinedContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { useShowSync } from '@/hooks/useShowSync';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { UiActions } from '@/state/ui/slice';
import { useTheme } from '@mui/joy/styles';
import { useSelector } from 'react-redux';
import { EllipsesP } from '../components/EllipsesP';
import { FileSystemLeaf } from '../tree/FileSystemLeaf';

interface EnvironmentFileSystemProps {
	environmentId: string;
}

export function EnvironmentFileSystem({ environmentId }: EnvironmentFileSystemProps) {
	const selectedEnvironment = useSelector(ActiveSelect.selectedEnvironment);
	const envSelected = selectedEnvironment === environmentId;
	const environment = useSelector((state) => ItemActions.environment.select(state, environmentId));
	const dispatch = useAppDispatch();
	const showSync = useShowSync(environmentId);
	const theme = useTheme();
	if (environment == null) {
		console.warn("the deletion bug hasn't been fixed yet");
		return <></>;
	}
	const color = envSelected ? theme.palette.primary.plainColor : undefined;
	return (
		<FileSystemLeaf
			color={color}
			id={environmentId}
			menuItems={[
				{
					action: () => dispatch(ActiveActions.selectEnvironment(envSelected ? undefined : environment.id)),
					text: envSelected ? 'Deselect' : 'Select',
				},
				PredefinedContextMenuItems.separator,
				ContextMenuItems.duplicate(() => dispatch(ItemActions.environment.duplicate(environment))),
				PredefinedContextMenuItems.separator,
				ContextMenuItems.delete(() => dispatch(UiActions.addToDeleteQueue(environment.id))),
			]}
		>
			<div style={{ flex: 0 }}>{showSync ? <FluentCubeLinkSvg /> : <FluentCubeSvg />}</div>
			<EllipsesP>{environment.name}</EllipsesP>
		</FileSystemLeaf>
	);
}
