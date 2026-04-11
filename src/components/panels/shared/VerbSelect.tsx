import { SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { verbColors } from '@/constants/style';
import type { RESTfulRequestVerb } from '@/types/data/shared';
import { RESTfulRequestVerbs } from '@/types/data/shared';
import { Label } from '@mui/icons-material';

interface VerbSelectProps {
	value: RESTfulRequestVerb;
	onChange?: (newVal: RESTfulRequestVerb) => void;
	open?: boolean;
	onClick?: () => void;
}

export function VerbSelect({ value, onChange, open, onClick }: VerbSelectProps) {
	const { color } = verbColors[value];
	return (
		<SprocketSelect
			sx={{
				minWidth: 150,
				color,
			}}
			listboxOpen={open}
			onListboxOpenChange={onClick}
			value={value}
			startDecorator={<Label sx={{ color }} />}
			variant="soft"
			onChange={(verb) => verb != null && onChange?.(verb)}
			options={RESTfulRequestVerbs.map((verb) => ({ value: verb, label: verb }))}
		/>
	);
}
