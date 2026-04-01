import { RustInvoker } from '@/managers/RustInvoker';
import { selectDefaultTheme, selectZoomLevel } from '@/state/active/selectors';
import { selectActiveWorkspace } from '@/state/global/selectors';
import { useColorScheme } from '@mui/joy';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { WorkspaceSelector } from '../workspaces/WorkspaceSelector';
import { RootErrorFallback } from './RootErrorFallback';
import { Toasts } from './Toasts';
import { Workspace } from './Workspace';
import { ListenerWrapper } from './listeners/ListenerWrapper';
import { ModalsWrapper } from './modals/ModalsWrapper';
import { LoadingWorkspaceOverlay } from './overlays/LoadingWorkspaceOverlay';

export function Root() {
	const activeWorkspace = useSelector(selectActiveWorkspace);
	const zoomLevel = useSelector(selectZoomLevel);
	const defaultTheme = useSelector(selectDefaultTheme);
	const { setMode } = useColorScheme();

	useEffect(() => {
		RustInvoker.closeSplashscreen();
	}, []);

	useEffect(() => {
		RustInvoker.zoom(zoomLevel / 100);
	}, [zoomLevel]);

	useEffect(() => {
		setMode(defaultTheme);
	}, [defaultTheme]);

	return (
		<>
			<LoadingWorkspaceOverlay />
			<ErrorBoundary FallbackComponent={RootErrorFallback}>
				{activeWorkspace == null ? (
					<WorkspaceSelector />
				) : (
					<>
						<Workspace />
						<ListenerWrapper />
					</>
				)}
				<ModalsWrapper />

				<Toasts />
			</ErrorBoundary>
		</>
	);
}
