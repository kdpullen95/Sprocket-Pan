import { maxAmplitude } from '@/utils/math';
import { useEffect, useRef } from 'react';

export function useSingleAxisScroll(axis: 'left' | 'top' = 'left') {
	const scrollRef = useRef<HTMLDivElement | null>(null);
	function scrollHorizontally(e: WheelEvent) {
		if (scrollRef.current == null) {
			return;
		}
		e.preventDefault();
		scrollRef.current.scrollBy({ [axis]: maxAmplitude(e.deltaX, e.deltaY, e.deltaZ) });
	}
	useEffect(() => {
		const current = scrollRef.current;
		current?.addEventListener('wheel', scrollHorizontally);
		return () => current?.removeEventListener('wheel', scrollHorizontally);
	});
	return scrollRef;
}
