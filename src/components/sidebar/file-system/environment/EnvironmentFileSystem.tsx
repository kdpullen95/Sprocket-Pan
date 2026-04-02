import { FluentCubeSvg } from '@/assets/icons/fluent/FluentCube';
import { FluentCubeLinkSvg } from '@/assets/icons/fluent/FluentCubeLink';
import { useShowSync } from '@/hooks/useShowSync';
import { selectSelectedEnvironment } from '@/state/active/selectors';
import { activeActions } from '@/state/active/slice';
import { itemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { CheckCircleOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/joy/styles';
import { useSelector } from 'react-redux';
import { EllipsesP } from '../components/EllipsesP';
import { menuOptionDelete, menuOptionDuplicate } from '../tree/FileSystemDropdown';
import { FileSystemLeaf } from '../tree/FileSystemLeaf';

interface EnvironmentFileSystemProps {
	environmentId: string;
}

export function EnvironmentFileSystem({ environmentId }: EnvironmentFileSystemProps) {
	const selectedEnvironment = useSelector(selectSelectedEnvironment);
	const envSelected = selectedEnvironment === environmentId;
	const environment = useSelector((state) => itemActions.environment.select(state, environmentId));
	const dispatch = useAppDispatch();
	const showSync = useShowSync(environmentId);
	const theme = useTheme();
	const color = envSelected ? theme.palette.primary.plainColor : undefined;
	return (
		<FileSystemLeaf
			color={color}
			id={environmentId}
			menuOptions={[
				{
					onClick: () => dispatch(activeActions.selectEnvironment(envSelected ? undefined : environment.id)),
					Icon: CheckCircleOutlined,
					label: envSelected ? 'Deselect' : 'Select',
				},
				menuOptionDuplicate(() => dispatch(itemActions.environment.duplicate(environment))),
				menuOptionDelete(() => dispatch(uiActions.addToDeleteQueue(environment.id))),
			]}
		>
			<div style={{ flex: 0 }}>{showSync ? <FluentCubeLinkSvg /> : <FluentCubeSvg />}</div>
			<EllipsesP>{environment.name}</EllipsesP>
		</FileSystemLeaf>
	);
}
