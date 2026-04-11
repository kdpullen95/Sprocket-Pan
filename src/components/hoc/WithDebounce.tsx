import { Constants } from '@/constants/constants';
import { useDebounce } from '@/hooks/useDebounce';
import type { ReactNode } from 'react';
import type { SprocketEditorProps } from '../shared/input/monaco/SprocketEditor';
import { SprocketEditor } from '../shared/input/monaco/SprocketEditor';

type InputOutput<T> = { value?: T; onChange?: (val?: T, ...trash: any) => void };

export function WithDebounce<V, T extends InputOutput<V>>(
	Component: (props: T) => ReactNode,
	debounceMS = Constants.debounceTimeMS,
) {
	return function ({ value, onChange, ...props }: T) {
		const [localDataState, setLocalDataState] = useDebounce({
			state: value,
			setState: (val) => onChange?.(val),
			debounceMS,
		});
		return <Component {...(props as T)} onChange={setLocalDataState} value={localDataState} />;
	};
}

export const DebouncedSprocketEditor = WithDebounce<string, SprocketEditorProps>(SprocketEditor);
