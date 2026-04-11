import { EditableData } from '@/components/shared/input/monaco/EditableData';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import { Box } from '@mui/joy';
import { useSelector } from 'react-redux';
import type { PanelProps } from '../panels.interface';

export function SecretsPanel(_: PanelProps) {
	const secrets = useSelector(ActiveSelect.secrets);
	const dispatch = useAppDispatch();
	return (
		<Box sx={{ height: '70vh', p: 2 }}>
			<EditableData
				initialValues={secrets}
				onChange={(values) => dispatch(ActiveActions.setSecrets(values))}
				fullSize
			/>
		</Box>
	);
}
