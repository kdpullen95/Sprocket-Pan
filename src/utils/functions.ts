import type { SprocketScriptContext } from '@/managers/scripts/SprocketScriptContext';
import type { Token } from '@/types/shared/misc';
import { getClearableTimeout, interruptingTimeout } from './misc';
import type { InterruptibleScriptReturn } from './types';

/**
 * Call an async function with a maximum time limit (in milliseconds) for the timeout
 * @param asyncPromise An asynchronous promise to resolve
 * @param timeLimit Time limit to attempt function in milliseconds
 * @returns Resolved promise for async function call, or rejected if time limit reached
 */
export function asyncCallWithTimeout<T>(asyncPromise: Promise<T>, timeLimit: number) {
	return Promise.race([getClearableTimeout(timeLimit).promise, asyncPromise]) as Promise<T>;
}

export function runContextfulInterruptibleScript<T>(
	script: string,
	sp: SprocketScriptContext,
	timeout?: number,
): InterruptibleScriptReturn<T> {
	const result = Object.getPrototypeOf(async () => {}).constructor('sp', 'sprocketPan', script)(sp, sp);
	return { result: interruptingTimeout(result, sp.interrupt, timeout), interrupt: sp.interrupt };
}

type Replacer = (key: string, value: unknown) => unknown;

export function combineReplacers(replacers: Replacer[]): Replacer {
	return (key: string, value: unknown) => {
		replacers.forEach((replacer) => {
			value = replacer(key, value);
		});
		return value;
	};
}

export function nullifyProperties<T>(...keys: (keyof T)[]): Replacer {
	return (key, value) => {
		if (keys.includes(key as never)) {
			return undefined;
		}
		return value;
	};
}

export function safeJsonParse<T>(str: string) {
	try {
		return [null, JSON.parse(str) as T] as const;
	} catch (err) {
		return [err, null] as const;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- I don't know how to type arbitrary args any other way
export function checkInterrupt<T, A extends any[]>(func: (...args: A) => T, token: Token<boolean>) {
	return (...args: A) => {
		if (token.current) {
			throw new Error(`operation interrupted, reason: ${token.comment}`);
		}
		return func(...args);
	};
}

export function clearLeafProperties<T extends object>(item: T, newValue: null | undefined) {
	for (const key in item) {
		if (typeof item[key] === 'object' && item[key] != null) {
			clearLeafProperties(item[key], newValue);
		} else {
			item[key] = newValue as T[typeof key];
		}
	}
}
