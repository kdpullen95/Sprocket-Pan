import { RustInvoker } from '@/managers/RustInvoker';
import { ActiveSelect } from '@/state/active/selectors';
import { GlobalSelect } from '@/state/global/selectors';
import { useColorScheme } from '@mui/joy';
import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { WorkspaceSelector } from '../workspaces/WorkspaceSelector';
import { RootErrorFallback } from './RootErrorFallback';
import { Toasts } from './Toasts';
import { Workspace } from './Workspace';
import { ModalsWrapper } from './modals/ModalsWrapper';
import { LoadingWorkspaceOverlay } from './overlays/LoadingWorkspaceOverlay';

export function Root() {
	const activeWorkspace = useSelector(GlobalSelect.activeWorkspace);
	const zoomLevel = useSelector(ActiveSelect.zoomLevel);
	const defaultTheme = useSelector(ActiveSelect.defaultTheme);
	const { setMode } = useColorScheme();

	useEffect(() => {
		RustInvoker.closeSplashscreen();
	}, []);

	useEffect(() => {
		RustInvoker.zoom(zoomLevel / 100);
	}, [zoomLevel]);

	useEffect(() => {
		setMode(defaultTheme);
	}, [defaultTheme, setMode]);

	return (
		<>
			<LoadingWorkspaceOverlay />
			<ErrorBoundary FallbackComponent={RootErrorFallback}>
				{activeWorkspace == null ? (
					<WorkspaceSelector />
				) : (
					<>
						<Workspace />
					</>
				)}
				<ModalsWrapper />

				<Toasts />
			</ErrorBoundary>
		</>
	);
}
