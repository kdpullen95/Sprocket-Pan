import { useAppDispatch } from '@/state/store';
import { selectNextForCreation } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { TabType } from '@/types/state/state';
import { JSX } from 'react';
import { useSelector } from 'react-redux';
import { CreateEnvironmentModal } from './createModals/CreateEnvironmentModal';
import { CreateModalsProps } from './createModals/createModalsProps';
import { CreateScriptModal } from './createModals/CreateScriptModal';
import { CreateServiceModal } from './createModals/CreateServiceModal';

const modalFromType: Partial<Record<TabType, (props: CreateModalsProps) => JSX.Element>> = {
	service: CreateServiceModal,
	environment: CreateEnvironmentModal,
	script: CreateScriptModal,
};

export function CreateQueueModals() {
	const nextForCreation = useSelector(selectNextForCreation);
	const dispatch = useAppDispatch();
	const defaultFunc = () => <></>;
	const CreateModal = modalFromType[nextForCreation] ?? defaultFunc;
	return (
		<CreateModal
			open={!!nextForCreation}
			closeFunc={() => {
				dispatch(uiActions.removeFromCreateQueue(nextForCreation));
			}}
		/>
	);
}
