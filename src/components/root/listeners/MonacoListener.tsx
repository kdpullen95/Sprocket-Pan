import { MonacoManager } from '@/managers/monaco/MonacoManager';
import { selectScripts } from '@/state/active/selectors';
import { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export function MonacoListener() {
	const monaco = useMonaco();
	const scripts = useSelector(selectScripts);

	useEffect(() => {
		if (monaco) {
			MonacoManager.init(monaco);
		}
	}, [monaco]);

	useEffect(() => {
		if (monaco) {
			MonacoManager.setInjectedCode(monaco, Object.values(scripts));
		}
	}, [monaco, scripts]);

	return <></>;
}
