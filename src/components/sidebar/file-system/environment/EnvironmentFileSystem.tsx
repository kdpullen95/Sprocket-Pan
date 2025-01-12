import { useSelector } from 'react-redux';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { selectSelectedEnvironment } from '@/state/active/selectors';
import { activeActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import { uiActions } from '@/state/ui/slice';
import { menuOptionDuplicate, menuOptionDelete } from '../tree/FileSystemDropdown';
import { FileSystemLeaf } from '../tree/FileSystemLeaf';
import { useShowSync } from '@/hooks/useShowSync';
import { FluentCubeLinkSvg } from '@/assets/icons/fluent/FluentCubeLink';
import { FluentCubeSvg } from '@/assets/icons/fluent/FluentCube';
import { EllipsesP } from '../components/EllipsesP';
import { itemActions } from '@/state/items';
import { SVGProps } from 'react';
import { useTheme } from '@mui/joy';

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
	const CubeIcon = (props: SVGProps<SVGSVGElement>) =>
		showSync ? <FluentCubeLinkSvg {...props} /> : <FluentCubeSvg {...props} />;
	const color = envSelected ? theme.palette.primary[400] : undefined;
	return (
		<FileSystemLeaf
			id={environmentId}
			menuOptions={[
				{
					onClick: () => dispatch(activeActions.selectEnvironment(envSelected ? undefined : environment.id)),
					Icon: CheckCircleOutlinedIcon,
					label: envSelected ? 'Deselect' : 'Select',
				},
				menuOptionDuplicate(() => dispatch(itemActions.environment.duplicate(environment))),
				menuOptionDelete(() => dispatch(uiActions.addToDeleteQueue(environment.id))),
			]}
		>
			<div style={{ flex: 0 }}>
				<CubeIcon color={color} />
			</div>
			<EllipsesP style={{ color: color }}>{environment.name}</EllipsesP>
		</FileSystemLeaf>
	);
}
