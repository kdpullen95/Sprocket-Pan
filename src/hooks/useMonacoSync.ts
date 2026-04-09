import { editor } from 'monaco-editor';
import { RefObject, useEffect, useMemo } from 'react';

type EditorRefs = editor.IStandaloneDiffEditor | editor.IStandaloneCodeEditor;
type EditorOption<T extends EditorRefs> = Parameters<T['updateOptions']>[0];

interface MonacoSyncProps<T extends EditorRefs> {
	base?: EditorOption<T>;
	options?: EditorOption<T>;
	ref: RefObject<T | null>;
}

export function useMonacoOptionsSync<T extends EditorRefs>({ base, options, ref }: MonacoSyncProps<T>) {
	const fullOptions = useMemo(() => ({ ...base, ...options }), [base, options]);
	useEffect(() => {
		if (options != null) {
			ref.current?.updateOptions(fullOptions);
		}
	}, [fullOptions, options, ref]);
	return fullOptions;
}
