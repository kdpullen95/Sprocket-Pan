import { Script } from '@/types/data/workspace';
import { useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { getScriptsAsCode } from '../scripts/scripts';
import { internalTypesRaw } from './internalTypes';

type Monaco = NonNullable<ReturnType<typeof useMonaco>>;

// this is hacky but how it has to be done because of
// https://github.com/microsoft/monaco-editor/issues/2696
// and more importanty
// https://github.com/microsoft/monaco-editor/pull/4544/files
// ^ when this PR is merged we can clean this up
let uriModelNumber = 0;
function updateModelDefinition(monaco: Monaco, injectedCode: string) {
	const filePath = `ts:sprocket/model${uriModelNumber}.ts`;
	const uri = monaco.Uri.parse(filePath);

	const toDispose = monaco.editor.getModels().find((x) => x.uri.toString() === uri.toString());
	if (toDispose) {
		toDispose?.dispose();
	}
	uriModelNumber++;
	const newFilePath = `ts:sprocket/model${uriModelNumber}.ts`;
	const newUri = monaco.Uri.parse(newFilePath);
	monaco.editor.createModel(injectedCode, 'typescript', newUri);
}

export function getInjectedCode(scripts: Script[]) {
	const ret = `${internalTypesRaw}
	const sp = {} as SprocketInjectedScripts;
	const sprocketPan = sp;
	${getScriptsAsCode(scripts)}`;
	return ret;
}

export function setInjectedCode(monaco: Monaco, scripts: Script[] = []) {
	updateModelDefinition(monaco, getInjectedCode(scripts));
}

export const defaultOptions = {
	tabSize: 2,
	insertSpaces: false,
	wordWrap: 'on',
	wrappingStrategy: 'simple',
	wrappingIndent: 'same',
} as const satisfies editor.IStandaloneEditorConstructionOptions;

export function init(monaco: Monaco) {
	monaco.typescript.javascriptDefaults.setDiagnosticsOptions({
		noSemanticValidation: false,
		noSyntaxValidation: false,
	});
	monaco.typescript.typescriptDefaults.setDiagnosticsOptions({
		diagnosticCodesToIgnore: [
			1375, //'await' expressions are only allowed at the top level of a file when that file is a module
			1378, //Top-level 'await' expressions are only allowed when the 'module' option is set to 'esnext' or 'system', and the 'target' option is set to 'es2017' or higher
			1108, //A 'return' statement can only be used within a function body.
		],
	});
	monaco.typescript.javascriptDefaults.setCompilerOptions({
		target: monaco.typescript.ScriptTarget.ESNext,
		module: monaco.typescript.ModuleKind.ESNext,
		allowNonTsExtensions: true,
		alwaysStrict: true,
		noUnusedParameters: true,
		noImplicitUseStrict: true,
		noUnusedLocals: true,
	});

	monaco.typescript.javascriptDefaults.setEagerModelSync(true);
	monaco.typescript.typescriptDefaults.setEagerModelSync(true);
	setInjectedCode(monaco);
}

export const MonacoManager = { init, setInjectedCode, getInjectedCode, defaultOptions };
