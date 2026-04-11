import type { Snippet } from '@/managers/EnvironmentContextResolver';
import { ActiveSelect } from '@/state/active/selectors';
import { VariableNameDisplay } from '@/types/data/settings';
import { Typography } from '@mui/joy';
import type { TypographyProps } from '@mui/joy/Typography/TypographyProps';
import { useSelector } from 'react-redux';
import { SprocketTooltip } from './SprocketTooltip';

interface EnvironmentTypographyProps {
	snippets: Snippet[];
	displayVariableNames?: VariableNameDisplay;
	typographyProps?: TypographyProps;
}

export function EnvironmentTypography({ snippets, displayVariableNames, typographyProps }: EnvironmentTypographyProps) {
	const settings = useSelector(ActiveSelect.settings);
	const displaySetting = displayVariableNames ?? settings.interface.variableNameDisplay;
	const shouldDisplayVariableNames = displaySetting === VariableNameDisplay.before;
	const shouldHoverVariableNames = displaySetting === VariableNameDisplay.hover;
	return (
		<Typography {...typographyProps}>
			{snippets.map((snippet, index) => {
				if (snippet.variableName == null) {
					return <span key={index}>{snippet.value}</span>;
				}
				const valueText = snippet.value ?? 'unknown';
				const shouldDisplayVariable = shouldDisplayVariableNames || snippet.value == null;
				const displayText = shouldDisplayVariable ? `${snippet.variableName}: ${valueText}` : valueText;
				return (
					<SprocketTooltip
						key={index}
						text={snippet.variableName}
						disabled={!shouldHoverVariableNames || snippet.value == null}
					>
						<Typography
							component="span"
							variant="outlined"
							color={snippet.value == null ? 'danger' : 'success'}
							sx={{ overflowWrap: 'break-word' }}
						>
							{displayText}
						</Typography>
					</SprocketTooltip>
				);
			})}
		</Typography>
	);
}
