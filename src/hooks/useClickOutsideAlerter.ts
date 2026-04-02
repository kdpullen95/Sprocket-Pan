import { useEffect } from 'react';

interface UseClickOutsideAlerterArgs {
	ref: React.RefObject<HTMLInputElement | null>;
	onOutsideClick: () => void;
}

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useClickOutsideAlerter({ ref, onOutsideClick }: UseClickOutsideAlerterArgs) {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (event.buttons !== 1) {
				return;
			}
			if (ref.current != null && !ref.current.contains(event.target as Node)) {
				onOutsideClick();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [ref]);
}
