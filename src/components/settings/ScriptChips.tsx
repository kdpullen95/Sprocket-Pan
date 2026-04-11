import { tabTypeIcon } from '@/constants/components';
import type { ScriptRunnerStrategy } from '@/types/data/settings';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { East, West } from '@mui/icons-material';
import { Chip, IconButton } from '@mui/joy';

interface ScriptChipsProps {
	prefix: string;
	strategy: ScriptRunnerStrategy;
	setStrategy: (strategy: ScriptRunnerStrategy) => void;
}

export function ScriptChips({ prefix, strategy, setStrategy }: ScriptChipsProps) {
	const [parent] = useAutoAnimate();
	return (
		<span ref={parent}>
			{strategy.map((strategyItem, index) => (
				<span key={`${strategyItem}`}>
					{index !== 0 && (
						<IconButton
							sx={{ verticalAlign: 'middle' }}
							size="sm"
							onClick={() => {
								const copy = structuredClone(strategy);
								const temp = copy[index];
								copy[index] = copy[index - 1];
								copy[index - 1] = temp;
								setStrategy(copy);
							}}
						>
							<West />
						</IconButton>
					)}
					<Chip sx={{ verticalAlign: 'middle' }} startDecorator={tabTypeIcon[strategyItem]}>
						{prefix}-{strategyItem}
					</Chip>
					{index !== 2 && (
						<IconButton
							size="sm"
							sx={{ verticalAlign: 'middle' }}
							onClick={() => {
								const copy = structuredClone(strategy);
								const temp = copy[index];
								copy[index] = copy[index + 1];
								copy[index + 1] = temp;
								setStrategy(copy);
							}}
						>
							<East />
						</IconButton>
					)}
				</span>
			))}
		</span>
	);
}
