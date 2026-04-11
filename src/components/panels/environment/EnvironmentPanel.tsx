import { SyncButton } from '@/components/shared/buttons/SyncButton';
import { EditableData, parseEditorJSON, toEditorJSON } from '@/components/shared/input/monaco/EditableData';
import { SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { EnvironmentContextResolver } from '@/managers/EnvironmentContextResolver';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import { toKeyValuePairs } from '@/utils/application';
import { AccountTree, RadioButtonChecked, RadioButtonUnchecked } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography } from '@mui/joy';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { PanelProps } from '../panels.interface';
import { EditableHeader } from '../shared/EditableHeader';

export function EnvironmentPanel({ id }: PanelProps) {
	const selectedEnvironment = useSelector(ActiveSelect.selectedEnvironment);
	const environments = useSelector(ActiveSelect.environments);
	const environment = environments[id];
	const secrets = useSelector(ActiveSelect.secrets);
	const dispatch = useAppDispatch();

	const envList = useMemo(
		() => Object.values(environments).filter((env) => env.id !== environment?.id),
		[environments, environment],
	);

	if (environment == null) {
		return <Typography>No Environment Found</Typography>;
	}

	function parseEditorText(text: string) {
		const pairs = toKeyValuePairs<string>(parseEditorJSON(text));
		const parsedPairs = EnvironmentContextResolver.buildEnvironmentVariables({
			secrets,
			rootEnv: { ...environment, pairs },
			rootAncestors: Object.values(environments),
		});
		return toEditorJSON(parsedPairs.toArray());
	}

	return (
		<Stack gap={2} p={2}>
			<EditableHeader
				left={
					<SprocketTooltip text={selectedEnvironment === id ? 'Unselect' : 'Select'}>
						<IconButton
							onClick={() => dispatch(ActiveActions.selectEnvironment(selectedEnvironment === id ? undefined : id))}
						>
							{selectedEnvironment === id ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
						</IconButton>
					</SprocketTooltip>
				}
				value={environment.name}
				onChange={(name) => dispatch(ActiveActions.updateEnvironment({ name, id }))}
				right={<SyncButton id={id} />}
			/>
			<Box sx={{ height: '70vh', pb: '5vh' }}>
				<EditableData
					actions={{
						start: (
							<SprocketSelect
								tooltip="Parent Environments"
								startDecorator={<AccountTree />}
								sx={{ minWidth: '250px' }}
								placeholder="None"
								multiple
								value={environment.parents ?? []}
								options={envList.map((env) => ({ value: env.id, label: env.name }))}
								onChange={(parents) => dispatch(ActiveActions.updateEnvironment({ parents, id }))}
							/>
						),
					}}
					initialValues={environment.pairs}
					onChange={(pairs) => dispatch(ActiveActions.updateEnvironment({ pairs, id }))}
					fullSize
					envPairs={secrets}
					viewParser={parseEditorText}
				/>
			</Box>
		</Stack>
	);
}
