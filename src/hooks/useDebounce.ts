import { Constants } from '@/constants/constants';
import { useEffect, useMemo, useState } from 'react';

interface UseDebounceProps<T> {
	state: T;
	setState: (newState: T) => void;
	debounceMS?: number;
	writeOnClose?: boolean;
	isEqual?: (state: T, debouncedState: T) => boolean;
}

export const useDebounce = <TData>({
	state,
	setState,
	debounceMS = Constants.debounceTimeMS,
	writeOnClose,
	isEqual = (a, b) => a === b,
}: UseDebounceProps<TData>) => {
	const [localDataState, setLocalDataState] = useState<TData>(state);

	const isDesync = useMemo(() => !isEqual(localDataState, state), [localDataState, state]);

	// When the state changes, set the local state to the state
	useEffect(() => {
		if (!isEqual(localDataState, state)) {
			setLocalDataState(structuredClone(state));
		}
	}, [state]);

	// when the local state changes, update the state
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (!isEqual(localDataState, state)) {
				setState(localDataState);
			}
		}, debounceMS);
		return () => clearTimeout(timeout);
	}, [localDataState]);

	// on component unmount, we want to save the local state
	useEffect(() => {
		return () => {
			if (writeOnClose && localDataState != null && !isEqual(localDataState, state)) {
				setState(localDataState);
			}
		};
	}, []);

	return [localDataState, setLocalDataState, isDesync] as const;
};
