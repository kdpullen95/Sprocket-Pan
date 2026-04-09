import { ContextMenuItems, PredefinedContextMenuItems } from '@/components/shared/context/ContextMenuItems';
import { itemActions } from '@/state/items';
import { useAppDispatch } from '@/state/store';
import { selectFilteredNestedIds } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { useSelector } from 'react-redux';
import { EllipsesP } from './components/EllipsesP';
import { VerbDiv } from './components/VerbDiv';
import { RequestFileSystem } from './RequestFileSystem';
import { FileSystemBranch } from './tree/FileSystemBranch';

interface EndpointFileSystemProps {
	endpointId: string;
}

export function EndpointFileSystem({ endpointId }: EndpointFileSystemProps) {
	const endpoint = useSelector((state) => itemActions.endpoint.select(state, endpointId));
	const requestIds = useSelector((state) => selectFilteredNestedIds(state, endpoint?.requestIds ?? []));
	const dispatch = useAppDispatch();

	if (endpoint == null) {
		return null;
	}

	return (
		<FileSystemBranch
			id={endpointId}
			menuItems={[
				ContextMenuItems.duplicate(() => dispatch(itemActions.endpoint.create(endpoint))),
				PredefinedContextMenuItems.separator,
				{
					action: () => dispatch(itemActions.request.create({ endpointId: endpoint.id })),
					text: 'Add Request',
				},
				PredefinedContextMenuItems.separator,
				ContextMenuItems.delete(() => dispatch(uiActions.addToDeleteQueue(endpoint.id))),
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
