import { Stack } from '@mui/joy';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { SettingsTabProps } from './types';
import { SettingsPaletteSelect, SettingsSelect, SettingsSlider, SettingsSwitch } from './SettingsFields';
import { BASE_THEME, LIST_STYLING, SCROLLBAR_VISIBILITY } from '@/types/data/settings';
import { Contrast, Opacity } from '@mui/icons-material';
import { SettingsGroup } from '../SettingsGroup';

export function DisplayTab({ overlay, settings, onChange }: SettingsTabProps) {
	return (
		<Stack spacing={3}>
			<SettingsGroup title="Spacing">
				<SettingsSlider
					value={settings.theme.zoom}
					overlay={overlay?.theme?.zoom}
					label="Zoom"
					onChange={(zoom) => onChange({ theme: { zoom } })}
					endDecorator="%"
					icon={<ZoomInIcon />}
					range={{ min: 25, max: 175 }}
				/>
				<SettingsSelect
					sx={{ width: 240 }}
					label="List Style"
					value={settings.theme.list}
					overlay={overlay?.theme?.list}
					onChange={(val) => onChange({ theme: { list: val } })}
					options={[
						{ value: LIST_STYLING.compact, label: 'Compact' },
						{ value: LIST_STYLING.default, label: 'Default' },
						{ value: LIST_STYLING.cozy, label: 'Cozy' },
					]}
				/>
				<SettingsSelect
					sx={{ width: 240 }}
					label="Scrollbar Visibility"
					value={settings.theme.scrollbarVisibility}
					overlay={overlay?.theme?.scrollbarVisibility}
					onChange={(val) => onChange({ theme: { scrollbarVisibility: val } })}
					options={[
						{ value: SCROLLBAR_VISIBILITY.compact, label: 'Compact' },
						{ value: SCROLLBAR_VISIBILITY.hidden, label: 'Invisible' },
						{ value: SCROLLBAR_VISIBILITY.visible, label: 'Visible' },
					]}
				/>
			</SettingsGroup>
			<SettingsGroup title="Theme">
				<SettingsSelect
					sx={{ width: 240 }}
					label="Base Theme"
					value={settings.theme.base}
					overlay={overlay?.theme?.base}
					onChange={(base) => onChange({ theme: { base } })}
					options={[
						{ value: BASE_THEME.light, label: 'Light Mode' },
						{ value: BASE_THEME.dark, label: 'Dark Mode' },
						{ value: BASE_THEME.default, label: 'System Default' },
					]}
				/>
				<SettingsSlider
					value={settings.theme.decoration.opacity}
					overlay={overlay?.theme?.decoration?.opacity}
					label="Decoration Opacity"
					onChange={(opacity) => onChange({ theme: { decoration: { opacity } } })}
					icon={<Opacity />}
					range={{ min: 0, max: 1, step: 0.05 }}
				/>
				<SettingsGroup title="Palettes">
					<SettingsPaletteSelect
						label="Primary"
						value={settings.theme.colors.primary}
						overlay={overlay?.theme?.colors?.primary}
						onChange={(primary) => onChange({ theme: { colors: { primary } } })}
					/>
					<SettingsPaletteSelect
						label="Neutral"
						value={settings.theme.colors.neutral}
						overlay={overlay?.theme?.colors?.neutral}
						onChange={(neutral) => onChange({ theme: { colors: { neutral } } })}
					/>
					<SettingsPaletteSelect
						label="Danger"
						value={settings.theme.colors.danger}
						overlay={overlay?.theme?.colors?.danger}
						onChange={(danger) => onChange({ theme: { colors: { danger } } })}
					/>
					<SettingsPaletteSelect
						label="Success"
						value={settings.theme.colors.success}
						overlay={overlay?.theme?.colors?.success}
						onChange={(success) => onChange({ theme: { colors: { success } } })}
					/>
					<SettingsPaletteSelect
						label="Warning"
						value={settings.theme.colors.warning}
						overlay={overlay?.theme?.colors?.warning}
						onChange={(warning) => onChange({ theme: { colors: { warning } } })}
					/>
				</SettingsGroup>
				<SettingsGroup title="Color Adjustment">
					<SettingsSwitch
						sx={{ width: 240 }}
						label="Filters"
						checked={settings.theme.filters.enabled}
						onChange={(enabled) => onChange({ theme: { filters: { enabled } } })}
						overlay={overlay?.theme?.filters?.enabled}
					/>
					<SettingsSlider
						label="Contrast"
						value={settings.theme.filters.contrast}
						onChange={(contrast) => onChange({ theme: { filters: { contrast } } })}
						icon={<Contrast />}
						range={{
							min: 0.8,
							max: 1.2,
							step: 0.01,
						}}
						overlay={overlay?.theme?.filters?.contrast}
					/>
				</SettingsGroup>
			</SettingsGroup>
		</Stack>
	);
}
