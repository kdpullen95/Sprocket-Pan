/* eslint-disable @typescript-eslint/no-empty-object-type */ // we're constrained by mui's choices
import { useComponentIdentifier } from '@/hooks/useComponentIdentifier';
import { Info } from '@mui/icons-material';
import { FormControl, FormHelperText, FormLabel, Option, Select } from '@mui/joy';
import type { SelectProps } from '@mui/joy/Select/SelectProps';
import type { SxProps } from '@mui/joy/styles/types';
import { SprocketTooltip } from '../SprocketTooltip';

export type SelectOption<T> = {
	value: T;
	group?: string;
} & ({ label: string } | { label: React.ReactNode; key: string | number });

type SelectValue<T, M extends boolean = false> = M extends false ? T : T[];

type SelectPropsSubset<T extends {}, M extends boolean = false> = Omit<
	SelectProps<T, M>,
	'onChange' | 'slotProps' | 'value'
>;

export interface SprocketSelectProps<T extends {}, M extends boolean = false> extends SelectPropsSubset<T, M> {
	multiple?: M;
	options: SelectOption<T>[];
	value: SelectValue<T, M>;
	onChange: (value: SelectValue<T, M>) => void;
	label?: string;
	controlSx?: SxProps;
	hint?: string;
	tooltip?: string;
}

export function SprocketSelect<T extends {}, M extends boolean = false>({
	label,
	options,
	onChange,
	controlSx,
	value,
	hint,
	tooltip,
	placeholder,
	...overrides
}: SprocketSelectProps<T, M>) {
	const aria = useComponentIdentifier();
	return (
		<FormControl sx={controlSx}>
			{label != null && (
				<FormLabel id={`select-${aria}-label`} htmlFor={`select-${aria}-button`}>
					{label}
					{tooltip != null && (
						<SprocketTooltip text={tooltip}>
							<Info />
						</SprocketTooltip>
					)}
				</FormLabel>
			)}
			<Select
				slotProps={{
					button: {
						id: `select-${aria}-button`,
						// TODO: Material UI set aria-labelledby correctly & automatically
						// but Base UI and Joy UI don't yet.
						'aria-labelledby': label == null ? undefined : `select-${aria}-label select-${aria}-button`,
					},
				}}
				placeholder={placeholder}
				// TODO: figure out how to not any here
				value={value as any}
				onChange={(_, value) => {
					if (value != null) {
						onChange(value as SelectValue<T, M>);
					}
				}}
				{...overrides}
			>
				{options.map((option) => (
					<Option key={'key' in option ? option.key : option.label} value={option.value}>
						{option.label}
					</Option>
				))}
			</Select>
			{hint != null && <FormHelperText>{hint}</FormHelperText>}
		</FormControl>
	);
}
