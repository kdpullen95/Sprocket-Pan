import type { Settings } from './settings';
import type { UiMetadata } from './shared';

export type GlobalData = {
	uiMetadata: UiMetadata;
	settings: Settings;
	lastSaved: number;
};
