import { useDebounce } from '@/hooks/useDebounce';
import { Script } from '@/types/data/workspace';
import { Cancel, Code, PlayCircle } from '@mui/icons-material';
import { Button, CircularProgress, FormControl, FormLabel, Input, Stack } from '@mui/joy';

interface ScriptActionsProps {
	script: Script;
	onChange: (script: Partial<Script>) => void;
	isRunning: boolean;
	isInterrupting: boolean;
	run: () => void;
	interrupt: () => void;
}

export function ScriptActions({ onChange, isRunning, run, isInterrupting, interrupt, script }: ScriptActionsProps) {
	const [state, setState] = useDebounce({
		state: script.scriptCallableName,
		setState: (newName: string) => onChange({ scriptCallableName: newName }),
	});

	const isValidScriptCallableName = /^[a-zA-Z0-9_]+$/.test(state);

	return (
		<Stack direction="row" spacing={2} justifyContent="space-between" alignItems="end">
			<Stack direction="row" gap={2}>
				<FormControl>
					<FormLabel>Script-Callable Name</FormLabel>
					<Input
						startDecorator={<Code />}
						size="md"
						variant="outlined"
						value={state}
						error={isValidScriptCallableName}
						onChange={(e) => setState(e.target.value)}
						color={isValidScriptCallableName ? 'primary' : 'danger'}
					></Input>
				</FormControl>
			</Stack>
			<FormControl>
				{isRunning ? (
					<Button
						sx={{ width: '200px' }}
						color="warning"
						startDecorator={<Cancel />}
						endDecorator={<CircularProgress />}
						disabled={isInterrupting}
						variant="outlined"
						onClick={interrupt}
					>
						{isInterrupting ? 'Cancelling' : 'Cancel'}
					</Button>
				) : (
					<Button
						sx={{ width: '200px' }}
						color="success"
						startDecorator={<PlayCircle />}
						variant="outlined"
						onClick={run}
					>
						Run
					</Button>
				)}
			</FormControl>
		</Stack>
	);
}
