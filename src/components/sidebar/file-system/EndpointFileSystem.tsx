import { ContextMenuItems, PredefinedContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { ItemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { UiSelect } from '@/state/ui/selectors';
import { UiActions } from '@/state/ui/slice';
import { useSelector } from 'react-redux';
import { EllipsesP } from './components/EllipsesP';
import { VerbDiv } from './components/VerbDiv';
import { RequestFileSystem } from './RequestFileSystem';
import { FileSystemBranch } from './tree/FileSystemBranch';

interface EndpointFileSystemProps {
	endpointId: string;
}

export function EndpointFileSystem({ endpointId }: EndpointFileSystemProps) {
	const endpoint = useSelector((state) => ItemActions.endpoint.select(state, endpointId));
	const requestIds = useSelector((state) => UiSelect.filteredNestedIds(state, endpoint?.requestIds ?? []));
	const dispatch = useAppDispatch();

	if (endpoint == null) {
		return null;
	}

	return (
		<FileSystemBranch
			id={endpointId}
			menuItems={[
				ContextMenuItems.duplicate(() => dispatch(ItemActions.endpoint.create(endpoint))),
				PredefinedContextMenuItems.separator,
				{
					action: () => dispatch(ItemActions.request.create({ endpointId: endpoint.id })),
					text: 'Add Request',
				},
				PredefinedContextMenuItems.separator,
				ContextMenuItems.delete(() => dispatch(UiActions.addToDeleteQueue(endpoint.id))),
			]}
			buttonContent={
				<>
					<VerbDiv verb={endpoint.verb} />
					<EllipsesP>{endpoint.name}</EllipsesP>
				</>
			}
		>
			{requestIds.map((requestId) => (
				<RequestFileSystem requestId={requestId} key={requestId} />
			))}
		</FileSystemBranch>
	);
}
