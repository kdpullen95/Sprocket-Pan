import { EnvironmentContextResolver } from '@/managers/EnvironmentContextResolver';
import { ActiveSelect } from '@/state/active/selectors';
import { ItemActions } from '@/state/items';
import { useSelector } from 'react-redux';

function useRootEnvironmentArgs() {
	const secrets = useSelector(ActiveSelect.secrets);
	const rootEnv = useSelector(ActiveSelect.selectedEnvironmentValue);
	const environments = useSelector(ActiveSelect.environments);
	return { secrets, rootEnv, rootAncestors: Object.values(environments) };
}

export function useComputedRootEnvironment() {
	const args = useRootEnvironmentArgs();
	return EnvironmentContextResolver.buildEnvironmentVariables(args);
}

export function useComputedServiceEnvironment(id?: string) {
	const args = useRootEnvironmentArgs();
	const service = useSelector((state) => ItemActions.service.select(state, id));
	const selectedEnvId = service == null ? null : useSelector(ActiveSelect.selectedServiceEnvironments)[service.id];
	return EnvironmentContextResolver.buildEnvironmentVariables({
		...args,
		servEnv: selectedEnvId == null ? null : service?.localEnvironments[selectedEnvId],
	});
}

export function useComputedRequestEnvironment(id?: string) {
	const args = useRootEnvironmentArgs();
	const request = useSelector((state) => ItemActions.request.select(state, id));
	const endpoint = useSelector((state) => ItemActions.endpoint.select(state, request?.endpointId));
	const service = useSelector((state) => ItemActions.service.select(state, endpoint?.serviceId));
	const selectedEnvId = service == null ? null : useSelector(ActiveSelect.selectedServiceEnvironments)[service.id];
	return EnvironmentContextResolver.buildEnvironmentVariables({
		...args,
		reqEnv: request?.environmentOverride,
		servEnv: selectedEnvId == null ? null : service?.localEnvironments[selectedEnvId],
	});
}
