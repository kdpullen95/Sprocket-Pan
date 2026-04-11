import { UiSelect } from '@/state/ui/selectors';
import { ItemPrefix } from '@/types/data/item';
import type { FunctionComponent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSelector } from 'react-redux';
import { ErrorFallback } from '../shared/ErrorFallback';
import { EndpointPanel } from './endpoint/EndpointPanel';
import { EnvironmentPanel } from './environment/EnvironmentPanel';
import type { PanelProps } from './panels.interface';
import { RequestPanel } from './request/RequestPanel';
import { ScriptPanel } from './script/ScriptPanel';
import { SecretsPanel } from './secrets/SecretsPanel';
import { ServicePanel } from './service/ServicePanel';
import { WorkspacePanel } from './workspace/WorkspacePanel';

const contentMap: Record<string | 'secrets', FunctionComponent<PanelProps>> = {
	[ItemPrefix.request]: RequestPanel,
	[ItemPrefix.environment]: EnvironmentPanel,
	[ItemPrefix.service]: ServicePanel,
	[ItemPrefix.endpoint]: EndpointPanel,
	[ItemPrefix.script]: ScriptPanel,
	[ItemPrefix.workspace]: WorkspacePanel,
	secrets: SecretsPanel,
};

function extractTabContent(id: string) {
	for (const key in contentMap) {
		if (id.startsWith(key)) {
			return contentMap[key];
		}
	}
	throw new Error(`could not determine tab content type from id ${id}`);
}

export function TabContent({ id }: PanelProps) {
	const Tab = extractTabContent(id);
	const selectedTab = useSelector(UiSelect.selectedTab);
	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<div style={{ display: selectedTab === id ? 'block' : 'none' }}>
				<Tab id={id} />
			</div>
		</ErrorBoundary>
	);
}
