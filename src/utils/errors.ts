export function getInfoFromError(err: unknown): string {
	if (err != null && typeof err === 'object') {
		if ('stack' in err && typeof err.stack === 'string') {
			return err.stack;
		}
	}
	return JSON.stringify(err);
}
