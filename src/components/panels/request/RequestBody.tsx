import { DebouncedSprocketEditor } from '@/components/hoc/WithDebounce';
import { EditableFormTable } from '@/components/shared/input/EditableFormTable';
import { SprocketSelect } from '@/components/shared/input/SprocketSelect';
import { activeActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import { RawBodyTypes, RequestBodyType, RequestBodyTypes } from '@/types/data/shared';
import { EndpointRequest } from '@/types/data/workspace';
import { getRequestBodyCategory } from '@/utils/conversion';
import { DataObject, List as ListIcon } from '@mui/icons-material';
import { Stack } from '@mui/joy';

interface RequestBodyProps {
	request: EndpointRequest;
}

export function RequestBody({ request }: RequestBodyProps) {
	const requestBodyCategory = getRequestBodyCategory(request.bodyType);
	const isRaw = requestBodyCategory === 'raw';
	const isTable = requestBodyCategory === 'table';
	const dispatch = useAppDispatch();

	function update(values: Partial<EndpointRequest>) {
		dispatch(activeActions.updateRequest({ ...values, id: request.id }));
	}

	console.log('request is updated to', { request });

	const onSelectChange = (value: RequestBodyType) => {
		if (value) {
			const data: Partial<EndpointRequest> = { bodyType: value };
			if (value === 'raw') {
				data.rawType = 'JSON';
			} else {
				data.rawType = undefined;
			}
			const bodyIsString = typeof request.body === 'string';
			const bodyIsNullish = request.body == undefined;
			const bodyIsTable = !bodyIsString && !bodyIsNullish;
			if (bodyIsTable && value === 'raw') {
				try {
					data.body = JSON.stringify(request.body);
				} catch (e) {
					data.body = '';
				}
			} else if (bodyIsString && getRequestBodyCategory(value) === 'table') {
				data.body = '';
			}
			update(data);
		}
	};

	const editorLanguage = isRaw && request.rawType != null ? request.rawType.toLocaleLowerCase() : undefined;

	return (
		<Stack gap={1}>
			<Stack direction="row" gap={2}>
				<SprocketSelect
					sx={{ flexGrow: 1 }}
					label="Body Type"
					startDecorator={<ListIcon />}
					value={request.bodyType}
					options={RequestBodyTypes.map((value) => ({ value, label: value }))}
					onChange={onSelectChange}
					color="primary"
				/>
				{isRaw && (
					<SprocketSelect
						sx={{ width: '200px' }}
						label="Text Type"
						startDecorator={<DataObject />}
						value={request.rawType ?? 'JSON'}
						options={RawBodyTypes.map((value) => ({ value, label: value }))}
						onChange={(rawType) => rawType != null && update({ rawType })}
						color="primary"
					/>
				)}
			</Stack>
			{editorLanguage && (
				<DebouncedSprocketEditor
					height="45vh"
					value={request.body as string}
					onChange={(body) => update({ body })}
					language={editorLanguage}
				/>
			)}
			{isTable && (
				<EditableFormTable
					data={request.body as Record<string, string>}
					setData={(newData) => update({ body: newData })}
				/>
			)}
		</Stack>
	);
}
