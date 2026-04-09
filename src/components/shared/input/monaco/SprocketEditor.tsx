import { useEditorTheme } from '@/hooks/useEditorTheme';
import { useMonacoOptionsSync } from '@/hooks/useMonacoSync';
import { MonacoManager } from '@/managers/monaco/MonacoManager';
import { Editor, EditorProps } from '@monaco-editor/react';
import { Box, Stack } from '@mui/joy';
import { editor } from 'monaco-editor';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { EditorActions } from './EditorActions';

export type SprocketEditorProps = Omit<EditorProps, 'onMount'> & {
	ActionBarItems?: ReactNode;
	formatOnChange?: boolean;
};

export function SprocketEditor({
	ActionBarItems = <Box />,
	formatOnChange = false,
	options,
	value,
	height = '100%',
	...overrides
}: SprocketEditorProps) {
	const editorTheme = useEditorTheme();
	const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
	const combinedOptions = useMonacoOptionsSync({ base: MonacoManager.defaultOptions, options, ref: editorRef });

	const format = useCallback(async () => {
		if (editorRef.current != null) {
			const current = editorRef.current;
			const action = () => current.getAction('editor.action.formatDocument')?.run();
			if (combinedOptions.readOnly) {
				current.updateOptions({ ...combinedOptions, readOnly: false });
				await action();
				current.updateOptions({ ...combinedOptions, readOnly: true });
			} else {
				await action();
			}
		}
	}, [combinedOptions]);

	useEffect(() => {
		if (formatOnChange) {
			format();
		}
	}, [value, formatOnChange, format]);

	return (
		<Box height={height}>
			<Stack direction="row" justifyContent="space-between" alignItems="end">
				{ActionBarItems}
				<EditorActions copyText={value} format={format} />
			</Stack>
			<Editor
				language="typescript"
				theme={editorTheme}
				options={combinedOptions}
				onMount={(editor) => {
					editorRef.current = editor;
					format();
				}}
				value={value}
				{...overrides}
			/>
		</Box>
	);
}
