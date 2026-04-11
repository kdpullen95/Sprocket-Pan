import { ContextMenuItems, PredefinedContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { UiThunks } from '@/state/ui/thunks';
import { useSelector } from 'react-redux';
import { EllipsesP } from '../components/EllipsesP';
import { EndpointFileSystem } from '../EndpointFileSystem';
import { FileSystemBranch } from '../tree/FileSystemBranch';

interface ServiceFileSystemProps {
	serviceId: string;
}

export function ServiceFileSystem({ serviceId }: ServiceFileSystemProps) {
	const service = useSelector((state) => ItemActions.service.select(state, serviceId));
	const endpointIds = useSelector((state) => UiSelect.filteredNestedIds(state, service?.endpointIds ?? []));

	const dispatch = useAppDispatch();
	if (service == null) {
		return null;
	}

	return (
		<FileSystemBranch
			id={serviceId}
			menuItems={[
				ContextMenuItems.duplicate(() => dispatch(ItemActions.service.duplicate(service))),
				PredefinedContextMenuItems.separator,
				{
					action: () => dispatch(ItemActions.endpoint.create({ serviceId: service.id })),
					text: 'Add Endpoint',
				},
				PredefinedContextMenuItems.separator,
				ContextMenuItems.collapse(() => dispatch(UiThunks.collapseAll(service.endpointIds))),
				ContextMenuItems.expand(() => dispatch(UiThunks.expandAll([service.id, ...service.endpointIds]))),
				PredefinedContextMenuItems.separator,
				ContextMenuItems.delete(() => dispatch(UiActions.addToDeleteQueue(service.id))),
			]}
			buttonContent={<EllipsesP>{service.name}</EllipsesP>}
		>
			{endpointIds.map((endpointId) => (
				<EndpointFileSystem endpointId={endpointId} key={endpointId} />
			))}
		</FileSystemBranch>
	);
}
