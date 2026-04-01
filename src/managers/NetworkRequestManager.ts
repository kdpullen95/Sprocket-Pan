import { OrderedKeyValuePairs } from '@/classes/OrderedKeyValuePairs';
import { CONTENT_TYPE } from '@/constants/request';
import { RootState } from '@/state/store';
import { AuditLog } from '@/types/data/audit';
import { RawBodyType, RawBodyTypes, SPHeaders } from '@/types/data/shared';
import { Endpoint, EndpointRequest, EndpointResponse, NetworkFetchRequest, Service } from '@/types/data/workspace';
import {
	getEnvValuesFromData,
	getSettingsFromState,
	iterToKeyValuePairs,
	queryParamsToString,
} from '@/utils/application';
import { errorToSprocketError, getRequestBodyCategory, rawBodyTypeToMime } from '@/utils/conversion';
import { asyncCallWithTimeout } from '@/utils/functions';
import { log } from '@/utils/logging';
import { capitalizeWord } from '@/utils/string';
import { fetch } from '@tauri-apps/plugin-http';
import yaml from 'js-yaml';
import * as xmlParse from 'xml2js';
import { AuditLogManager } from './AuditLogManager';
import { StateAccessManager } from './data/StateAccessManager';
import { BuildEnvironmentVariablesArgs, EnvironmentContextResolver } from './EnvironmentContextResolver';
import { RunTypescriptWithFullContextArgs, ScriptRunnerManager } from './scripts/ScriptRunnerManager';

const xmlBuilder = new xmlParse.Builder();

export function serializeRequest(
	request: EndpointRequest,
	parsedBody?: Record<string, unknown> | unknown[] | string,
): string | undefined {
	if (parsedBody == null) {
		return undefined;
	}
	const category = getRequestBodyCategory(request.bodyType);
	if (request.rawType === 'JSON' || category === 'table') {
		return JSON.stringify(parsedBody);
	}
	if (request.rawType === 'Yaml') {
		return yaml.dump(parsedBody, { skipInvalid: true });
	}
	if (request.rawType === 'XML') {
		return xmlBuilder.buildObject(parsedBody);
	}
	if (typeof parsedBody === 'string') {
		return parsedBody;
	}
}

type ScriptObjs = { service: Service; endpoint: Endpoint; request: EndpointRequest };

function buildScripts(state: RootState, scriptObjs: ScriptObjs, type: 'pre' | 'post') {
	return getSettingsFromState(state).script.strategy[type].map((strat) => ({
		script: scriptObjs[strat] ? scriptObjs[strat][`${type}RequestScript`]?.trim() || undefined : undefined,
		name: `${type}${capitalizeWord(strat)}Script` as const,
		id: scriptObjs[strat]?.id,
	}));
}

async function parseRequestForEnvironmentOverrides(request: EndpointRequest) {
	if (request.bodyType === 'none' || request.body == undefined) {
		return undefined;
	}
	if (request.rawType === 'JSON' || request.rawType === 'Yaml') {
		return yaml.load(request.body as string) as Record<string, unknown>;
	}
	if (request.rawType === 'XML') {
		return (await xmlParse.parseStringPromise(request.body)) as Record<string, unknown>;
	}
	return request.body as Record<string, unknown> | undefined;
}

async function resolveHeaders(src: SPHeaders, dest: OrderedKeyValuePairs<string>, env: BuildEnvironmentVariablesArgs) {
	src.forEach((header) => {
		if (header.value == null) {
			return;
		}
		const parsedKey = EnvironmentContextResolver.resolveVariablesForString(header.key, env);
		dest.set(parsedKey, EnvironmentContextResolver.resolveVariablesForString(header.value, env));
	});
}

function headersContentTypeToBodyType(contentType: string | null): RawBodyType {
	let bodyType: RawBodyType = 'Text';
	if (contentType == null) {
		return bodyType;
	}
	RawBodyTypes.forEach((rawBodyType) => {
		if (contentType.toLowerCase().includes(rawBodyType.toLowerCase())) {
			bodyType = rawBodyType;
		}
	});
	return bodyType;
}

async function prepareRequestBody(request: EndpointRequest, envValues: BuildEnvironmentVariablesArgs) {
	const body = await parseRequestForEnvironmentOverrides(request);
	if (body != undefined && typeof body != 'string') {
		return EnvironmentContextResolver.resolveVariablesForMappedObject(body, envValues);
	}
	return body;
}

function prepareNetworkBody(request: EndpointRequest, serializedBody: string, category: string) {
	if (category === 'table') {
		if (request.bodyType === 'x-www-form-urlencoded') {
			throw new Error('Reimplement this!!');
		} else {
			return serializedBody;
		}
	} else if (category !== 'none') {
		return serializedBody;
	}
}

async function makeRequestWithScripts(requestId: string, auditLog: AuditLog = []) {
	let ret;
	const timestamp = new Date().getTime();
	try {
		await runScripts(requestId, auditLog);
		const state = StateAccessManager.getState();
		ret = await sendRequest(requestId, state, auditLog);
		await runScripts(requestId, auditLog, ret.response);
		return { ...ret, timestamp, auditLog };
	} catch (err) {
		return { ...ret, timestamp, auditLog, error: errorToSprocketError(err) };
	}
}

async function runScripts(requestId: string, auditLog: AuditLog = [], response?: EndpointResponse) {
	const state = StateAccessManager.getState();
	const data = state.active;
	const request = data.requests[requestId];
	const endpointId = request.endpointId;
	const endpoint = data.endpoints[endpointId];
	const service = data.services[endpoint.serviceId];
	const scriptObjs = { service, endpoint, request };
	const scripts = buildScripts(state, scriptObjs, response == null ? 'pre' : 'post');
	for (const script of scripts) {
		if (script.script != undefined) {
			const interruptible = runScript({
				script: script.script,
				requestId,
				response,
				auditLog,
				type: script.name,
				associatedId: script.id,
			});
			await interruptible.result;
		}
	}
}

async function sendRequest(requestId: string, state: RootState, auditLog: AuditLog = []) {
	const data = state.active;
	const envValues = getEnvValuesFromData(data, requestId);
	const request = data.requests[requestId];
	const endpoint = data.endpoints[request.endpointId];
	const service = data.services[endpoint.serviceId];
	const unparsedUrl = `${service.baseUrl}${endpoint.url}`;
	const url = EnvironmentContextResolver.resolveVariablesForString(unparsedUrl, envValues);
	const body = await prepareRequestBody(request, envValues);
	const headers = new OrderedKeyValuePairs();

	log.info(`Resolving endpoint headers ${JSON.stringify(endpoint.baseHeaders)}`);

	resolveHeaders(endpoint.baseHeaders, headers, envValues);
	resolveHeaders(request.headers, headers, envValues);

	const fullQueryParams = new OrderedKeyValuePairs(endpoint.baseQueryParams, request.queryParams);

	let queryParamStr = queryParamsToString(fullQueryParams.toArray(), true, (text) =>
		EnvironmentContextResolver.resolveVariablesForString(text, envValues),
	);

	if (queryParamStr != null) {
		queryParamStr = `?${queryParamStr}`;
	}

	const networkRequestBodyText = serializeRequest(request, body) ?? '';
	const category = getRequestBodyCategory(request.bodyType);
	const networkBody = prepareNetworkBody(request, networkRequestBodyText, category);
	if (category !== 'none' && headers.get(CONTENT_TYPE) == null) {
		headers.set(CONTENT_TYPE, rawBodyTypeToMime(request.rawType));
	}

	AuditLogManager.addToAuditLog(auditLog, 'before', 'request', request?.id);

	const networkRequest: NetworkFetchRequest = {
		url: `${url}${queryParamStr}`,
		method: endpoint.verb,
		body: networkRequestBodyText,
		headers: headers.toObject(),
		dateTime: new Date().getTime(),
		bodyType: request.rawType,
	};

	const networkCall = fetch(networkRequest.url, {
		method: networkRequest.method,
		body: networkBody,
		headers: networkRequest.headers,
	});

	const res: Awaited<ReturnType<typeof fetch>> = await asyncCallWithTimeout(
		networkCall,
		getSettingsFromState(state).request.timeoutMS,
	);
	AuditLogManager.addToAuditLog(auditLog, 'after', 'request', request?.id);

	const responseText = await res.text();
	const response = {
		statusCode: res.status,
		headers: iterToKeyValuePairs(res.headers.entries()),
		bodyType: headersContentTypeToBodyType(res.headers.get('content-type')),
		body: responseText,
		dateTime: new Date().getTime(),
	};
	return { response, request: networkRequest };
}

function runScript(args: Partial<RunTypescriptWithFullContextArgs>) {
	if (args.script == null) {
		throw new Error("cannot run script that doesn't exist");
	}
	if (args.auditLog != undefined) {
		AuditLogManager.addToAuditLog(args.auditLog, 'before', 'standaloneScript', args.associatedId);
	}
	const result = ScriptRunnerManager.runTypescriptWithFullContext(args as RunTypescriptWithFullContextArgs);
	if (args.auditLog != undefined) {
		AuditLogManager.addToAuditLog(args.auditLog, 'after', 'standaloneScript', args.associatedId);
	}
	return result;
}

export const NetworkRequestManager = { runScript, sendRequest, makeRequestWithScripts, runScripts };
