import { AdoptionModals } from './AdoptionModals';
import { DeleteQueueModals } from './DeleteQueueModals';
import { DiffQueueModals } from './DiffQueueModals';

export function ModalsWrapper() {
	return (
		<>
			<DeleteQueueModals />
			<DiffQueueModals />
			<AdoptionModals />
		</>
	);
}
