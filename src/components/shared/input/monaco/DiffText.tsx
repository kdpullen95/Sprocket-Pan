import { useEditorTheme } from '@/hooks/useEditorTheme';
import { useMonacoOptionsSync } from '@/hooks/useMonacoSync';
import { MonacoManager } from '@/managers/monaco/MonacoManager';
import { DiffEditor, DiffEditorProps } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { useCallback, useEffect, useRef } from 'react';

const base = {
	...MonacoManager.defaultOptions,
	readOnly: true,
	domReadOnly: true,
	originalEditable: false,
};

export function DiffText({ original, modified, options, width, height, language, ...props }: DiffEditorProps) {
	const editorTheme = useEditorTheme();
	const editorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

	const combinedOptions = useMonacoOptionsSync({ base, options, ref: editorRef });

	const format = useCallback(async () => {
		if (editorRef.current != null) {
			editorRef.current?.updateOptions({ ...combinedOptions, readOnly: false, originalEditable: true });
			const formatFirst = editorRef.current.getOriginalEditor().getAction('editor.action.formatDocument')?.run();
			const formatSecond = editorRef.current.getModifiedEditor().getAction('editor.action.formatDocument')?.run();
			await Promise.all([formatFirst, formatSecond]);
			editorRef.current?.updateOptions(combinedOptions);
		}
	}, [combinedOptions]);

	useEffect(() => {
		format();
	}, [original, modified, format]);

	return (
		<DiffEditor
			language={language ?? 'json'}
			theme={editorTheme}
			options={combinedOptions}
			onMount={(editor) => {
				editorRef.current = editor;
				format();
			}}
			original={original}
			modified={modified}
			width={width}
			height={height}
			{...props}
		/>
	);
}
