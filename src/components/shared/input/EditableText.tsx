import { Cancel, Check, ModeEdit } from '@mui/icons-material';
import { Box, IconButton, Input, Stack } from '@mui/joy';
import { TypographyProps } from '@mui/joy/Typography/TypographyProps';
import { useEffect, useState } from 'react';
import { EllipsisTypography } from '../EllipsisTypography';
import { SprocketTooltip } from '../SprocketTooltip';

export interface EditableTextProps extends Partial<TypographyProps> {
	text?: string;
	setText: (text: string) => void;
	isValidFunc?: (text: string) => boolean;
	size?: 'lg' | 'md' | 'sm';
}

const widths = {
	lg: '340px',
	md: '240px',
	sm: '140px',
} as const;

export function EditableText({
	text = '',
	setText,
	isValidFunc = (text) => text.length >= 1,
	sx,
	size = 'md',
	...props
}: EditableTextProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [typingText, setTypingText] = useState(text);

	const isValid = isValidFunc(text);

	const commitInput = () => {
		if (isValid) {
			setText(typingText);
			setIsEditing(false);
		}
	};

	const toggleEditing = () => {
		if (isEditing) {
			setIsEditing(false);
		} else {
			setTypingText(text);
			setIsEditing(true);
		}
	};

	useEffect(() => {
		setTypingText(text);
		setIsEditing(false);
	}, [text]);

	return (
		<Stack
			direction="row"
			maxWidth="calc(100% - 25px)"
			width="fit-content"
			alignItems="center"
			minHeight="2.5em"
			sx={{ position: 'relative', ...sx }}
		>
			{isEditing && (
				<Box width="100%" minWidth={widths[size]} sx={{ position: 'absolute', zIndex: 3 }}>
					<Input
						size={size}
						autoFocus
						fullWidth
						color="primary"
						variant="soft"
						placeholder={text}
						value={typingText}
						onChange={(e) => setTypingText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								commitInput();
							}
						}}
						error={!isValid}
						startDecorator={
							<SprocketTooltip text="Cancel">
								<IconButton sx={{ ml: '-10px' }} onClick={toggleEditing} size="sm">
									<Cancel />
								</IconButton>
							</SprocketTooltip>
						}
						endDecorator={
							<SprocketTooltip text="Save">
								<IconButton
									disabled={!isValid}
									color="success"
									variant="solid"
									sx={{ mr: '-10px' }}
									onClick={commitInput}
									size="sm"
								>
									<Check />
								</IconButton>
							</SprocketTooltip>
						}
					/>
				</Box>
			)}
			<Box>
				<SprocketTooltip text="Edit" sx={{ flexBasis: 0 }}>
					<IconButton onClick={toggleEditing} disabled={isEditing} size="sm">
						<ModeEdit />
					</IconButton>
				</SprocketTooltip>
			</Box>
			<Box position="relative" flexGrow={1} width="100%" minWidth={0} sx={{ opacity: isEditing ? 0 : 1 }}>
				<EllipsisTypography {...props}>{text}</EllipsisTypography>
			</Box>
		</Stack>
	);
}
