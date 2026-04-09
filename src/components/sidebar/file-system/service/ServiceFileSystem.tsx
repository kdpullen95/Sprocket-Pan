import { ContextMenuItems, PredefinedContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { itemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { selectFilteredNestedIds } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { collapseAll, expandAll } from '@/state/ui/thunks';
import { useSelector } from 'react-redux';
import { EllipsesP } from '../components/EllipsesP';
import { EndpointFileSystem } from '../EndpointFileSystem';
import { FileSystemBranch } from '../tree/FileSystemBranch';

interface ServiceFileSystemProps {
	serviceId: string;
}

export function ServiceFileSystem({ serviceId }: ServiceFileSystemProps) {
	const service = useSelector((state) => itemActions.service.select(state, serviceId));
	const endpointIds = useSelector((state) => selectFilteredNestedIds(state, service?.endpointIds ?? []));

	const dispatch = useAppDispatch();
	if (service == null) {
		return null;
	}

	return (
		<FileSystemBranch
			id={serviceId}
			menuItems={[
				ContextMenuItems.duplicate(() => dispatch(itemActions.service.duplicate(service))),
				PredefinedContextMenuItems.separator,
				{
					action: () => dispatch(itemActions.endpoint.create({ serviceId: service.id })),
					text: 'Add Endpoint',
				},
				PredefinedContextMenuItems.separator,
				ContextMenuItems.collapse(() => dispatch(collapseAll(service.endpointIds))),
				ContextMenuItems.expand(() => dispatch(expandAll([service.id, ...service.endpointIds]))),
				PredefinedContextMenuItems.separator,
				ContextMenuItems.delete(() => dispatch(uiActions.addToDeleteQueue(service.id))),
			]}
			buttonContent={<EllipsesP>{service.name}</EllipsesP>}
		>
			{endpointIds.map((endpointId) => (
				<EndpointFileSystem endpointId={endpointId} key={endpointId} />
			))}
		</FileSystemBranch>
	);
}
