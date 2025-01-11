import { WorkspaceDataManager } from '@/managers/data/WorkspaceDataManager';
import { getAncestors, getDescendents } from '@/utils/getters';
import { uiActions } from '@/state/ui/slice';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '@/state/store';
import { activeActions, activeThunkName, UpdateLinkedEnv } from './slice';
import { IconButton, Typography } from '@mui/joy';
import { errorToSprocketError } from '@/utils/conversion';
import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { appLogDir } from '@tauri-apps/api/path';
import { RustInvoker } from '@/managers/RustInvoker';
import { log } from '@/utils/logging';

interface RelinkEnvironmentsArgs extends Omit<UpdateLinkedEnv, 'envId'> {
	remove: string[];
	add: string[];
}

export const relinkEnvironments = createAsyncThunk<void, RelinkEnvironmentsArgs, { state: RootState }>(
	`${activeThunkName}/relinkEnvironments`,
	async ({ remove, add, serviceEnvId, serviceId }, thunk) => {
		remove.forEach((envId) => thunk.dispatch(activeActions.removeLinkedEnv({ envId, serviceId })));
		add.forEach((envId) => thunk.dispatch(activeActions.addLinkedEnv({ envId, serviceEnvId, serviceId })));
	},
);

export const saveActiveData = createAsyncThunk<void, void, { state: RootState }>(
	`${activeThunkName}/saveData`,
	async (_, thunk) => {
		const { active, ui } = thunk.getState();
		const { lastModified, lastSaved, ...data } = active;
		if (lastModified < lastSaved || ui.orphans != null) return;
		try {
			await WorkspaceDataManager.saveData(data);
			thunk.dispatch(activeActions.setSavedNow());
		} catch (err) {
			log.error(err);
			thunk.dispatch(
				uiActions.toast({
					title: `Failed to save all files`,
					details: (
						<>
							<Typography color="danger" level="body-sm">
								{errorToSprocketError(err).message}
								<SprocketTooltip text="Open Logs">
									<IconButton
										color="primary"
										variant="plain"
										onClick={async () => {
											const logDir = await appLogDir();
											RustInvoker.showInExplorer({ path: `${logDir}${log.LOG_FILE_NAME}`, absolute: true });
										}}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 12 12">
											<path
												fill="currentColor"
												d="M4 3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V7a.5.5 0 0 1 1 0v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h1a.5.5 0 0 1 0 1zm3 0a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .5.5V5a.5.5 0 0 1-1 0V3.707L7.354 5.354a.5.5 0 1 1-.708-.708L8.293 3z"
											></path>
										</svg>
									</IconButton>
								</SprocketTooltip>
							</Typography>
						</>
					),
					color: 'danger',
				}),
			);
			log.error(err);
		}
	},
);

export const toggleSync = createAsyncThunk<void, string, { state: RootState }>(
	`${activeThunkName}/toggleSync`,
	(id, thunk) => {
		const state = thunk.getState().active;
		if (state.syncMetadata.items[id]) {
			[id, ...getDescendents(state, id)].forEach((itemId) => {
				thunk.dispatch(activeActions.setSyncItem({ id: itemId, value: false }));
			});
		} else {
			[id, ...getAncestors(state, id)].forEach((itemId) => {
				thunk.dispatch(activeActions.setSyncItem({ id: itemId, value: true }));
			});
		}
	},
);
