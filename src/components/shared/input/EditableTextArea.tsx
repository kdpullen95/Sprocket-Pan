import { Cancel, Check, ModeEdit } from '@mui/icons-material';
import { Box, IconButton, Stack, Textarea } from '@mui/joy';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { SprocketTooltip } from '../SprocketTooltip';

interface EditableTextAreaProps {
	fallback?: string;
	text?: string;
	setText: (text: string) => void;
	isValidFunc?: (text: string) => boolean;
}

export function EditableTextArea({ fallback, text, setText, isValidFunc = () => true }: EditableTextAreaProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [typingText, setTypingText] = useState(text ?? '');

	const isValid = isValidFunc(typingText);

	function toggleEditing() {
		if (isEditing) {
			if (isValid) {
				setText(typingText);
				setIsEditing(false);
			}
		} else {
			setTypingText(text ?? '');
			setIsEditing(true);
		}
	}

	useEffect(() => {
		setTypingText(text ?? '');
		setIsEditing(false);
	}, [text]);

	return (
		<Stack direction="row">
			<Stack sx={{ mt: '10px' }}>
				<SprocketTooltip text={isEditing ? 'Save' : 'Edit'}>
					<IconButton onClick={toggleEditing} disabled={isEditing && !isValid} size="sm">
						{isEditing ? <Check /> : <ModeEdit />}
					</IconButton>
				</SprocketTooltip>
				{isEditing && (
					<SprocketTooltip text="Cancel">
						<IconButton onClick={() => setIsEditing(false)} size="sm">
							<Cancel />
						</IconButton>
					</SprocketTooltip>
				)}
			</Stack>
			{isEditing ? (
				<Textarea
					sx={{ width: '100%', mt: '10px' }}
					variant="outlined"
					placeholder={fallback}
					value={typingText}
					onChange={(e) => setTypingText(e.target.value)}
					error={!isValid}
				/>
			) : (
				<Box sx={{ px: '10px' }}>
					<Markdown>{text}</Markdown>
				</Box>
			)}
		</Stack>
	);
}
