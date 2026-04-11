import '@fontsource/inter';
import { StyledEngineProvider, ThemeProvider } from '@mui/joy/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<StyledEngineProvider injectFirst>
			<ThemeProvider>
				<App />
			</ThemeProvider>
		</StyledEngineProvider>
	</React.StrictMode>,
);
