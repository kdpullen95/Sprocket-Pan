import { Box, FormControl, FormLabel, IconButton, Stack } from '@mui/joy';
import { Public } from '@mui/icons-material';
import { StrategyInput, StrategyInputProps } from './StrategyInput';
import { InputSliderProps, InputSlider } from '@/components/shared/input/InputSlider';
import { SprocketInputProps, SprocketInput } from '@/components/shared/input/SprocketInput';
import { SprocketSwitchProps, SprocketSwitch } from '@/components/shared/input/SprocketSwitch';
import { SprocketSelectProps, SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { PaletteSelect, PaletteSelectProps } from '@/components/shared/input/PaletteSelect';
import { SxProps } from '@mui/joy/styles/types';

interface ResetButtonProps {
	override: boolean;
	onChange: (value: undefined) => void;
	sx?: SxProps;
}

export function ResetButton({ override, onChange, sx }: ResetButtonProps) {
	if (override) {
		return (
			<SprocketTooltip text="Reset to Global Setting" sx={sx}>
				<IconButton size="sm" onClick={() => onChange(undefined)}>
					<Public />
				</IconButton>
			</SprocketTooltip>
		);
	}
	return <Box width={32} />;
}

// there has to be some way to wrap these in a HOC.

interface SettingsFieldProps<T> {
	overlay: T | undefined;
	onChange: (arg: T | undefined) => void;
}

export function SettingsSelect<T>({
	value,
	overlay,
	onChange,
	...props
}: SprocketSelectProps<T> & SettingsFieldProps<T>) {
	const override = overlay !== undefined;
	return (
		<Stack direction="row" gap={1} alignItems="start">
			<SprocketSelect onChange={onChange} value={override ? overlay : value} {...props} />
			<ResetButton onChange={onChange} override={override} sx={{ mt: '2em' }} />
		</Stack>
	);
}

export function SettingsInput({
	value,
	overlay,
	onChange,
	...props
}: SprocketInputProps & SettingsFieldProps<SprocketInputProps['value']>) {
	const override = overlay !== undefined;
	return (
		<Stack direction="row" gap={1} alignItems="start">
			<SprocketInput onChange={onChange} value={override ? overlay : value} {...props} />
			<ResetButton onChange={onChange} override={override} sx={{ mt: '2em' }} />
		</Stack>
	);
}

export function SettingsPaletteSelect({
	value,
	overlay,
	onChange,
	...props
}: PaletteSelectProps & SettingsFieldProps<string>) {
	console.log({ value, overlay });
	const override = overlay !== undefined;
	console.log({ override });
	return (
		<Stack direction="row" gap={1} alignItems="start">
			<PaletteSelect value={override ? overlay : value} onChange={onChange} {...props} />
			<ResetButton onChange={onChange} override={override} sx={{ mt: '1.65em' }} />
		</Stack>
	);
}

export function SettingsStrategyInput({
	value,
	overlay,
	onChange,
}: StrategyInputProps & SettingsFieldProps<StrategyInputProps['value']>) {
	const override = overlay !== undefined;
	return (
		<FormControl sx={{ width: 'fit-content' }}>
			<FormLabel>Script Execution Order</FormLabel>
			<Stack direction="row" gap={1} alignItems="start">
				<StrategyInput value={override ? overlay : value} onChange={onChange} />
				<ResetButton onChange={onChange} override={override} />
			</Stack>
		</FormControl>
	);
}

export function SettingsSlider({ value, overlay, onChange, ...props }: InputSliderProps & SettingsFieldProps<number>) {
	const override = overlay !== undefined;
	return (
		<Stack direction="row" alignItems="start" gap={1}>
			<InputSlider value={override ? overlay : value} onChange={onChange} {...props} />
			<ResetButton onChange={onChange} override={override} sx={{ mt: '2em' }} />
		</Stack>
	);
}

export function SettingsSwitch({
	checked,
	overlay,
	onChange,
	...props
}: SprocketSwitchProps & SettingsFieldProps<boolean>) {
	const override = overlay !== undefined;
	return (
		<Stack direction="row" alignItems="start" gap={1} minHeight="2em">
			<SprocketSwitch checked={override ? overlay : checked} onChange={onChange} {...props} />
			<ResetButton onChange={onChange} override={override} sx={{ mt: '1.5em' }} />
		</Stack>
	);
}
