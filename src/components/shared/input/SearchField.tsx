import { Constants } from '@/constants/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { ClearRounded, PendingOutlined, Search } from '@mui/icons-material';
import { IconButton, Input } from '@mui/joy';
import { SxProps } from '@mui/joy/styles/types';
import { SprocketTooltip } from '../SprocketTooltip';

export interface SearchFieldProps {
	onChange: (text: string) => void;
	value: string;
	debounce?: number;
	slideout?: boolean;
	sx?: SxProps;
}

export function SearchField({ onChange, value, debounce = Constants.searchDebounceTimeMS, sx }: SearchFieldProps) {
	const [localDataState, setLocalDataState, isDesync] = useDebounce<string | null>({
		state: value,
		setState: (text: string | null) => onChange(text ?? ''),
		debounceMS: debounce,
	});

	function cancel() {
		setLocalDataState('');
		onChange('');
	}

	return (
		<Input
			fullWidth
			size="sm"
			variant="outlined"
			placeholder="Search"
			sx={{ minWidth: '150px', flex: 1, ...sx }}
			startDecorator={<Search />}
			endDecorator={
				isDesync ? (
					<PendingOutlined color="secondary" />
				) : (
					<SprocketTooltip text="Clear search">
						<IconButton onClick={cancel}>
							<ClearRounded color="primary" />
						</IconButton>
					</SprocketTooltip>
				)
			}
			value={localDataState || ''}
			onChange={(e) => setLocalDataState(e.target.value)}
		/>
	);
}
