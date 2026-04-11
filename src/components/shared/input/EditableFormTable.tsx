import { useDebounce } from '@/hooks/useDebounce';
import { getDuplicateKeys } from '@/utils/misc';
import { AddBox, Delete } from '@mui/icons-material';
import { IconButton, Input, Sheet, Table } from '@mui/joy';
import { useMemo } from 'react';
import { SprocketTooltip } from '../SprocketTooltip';

type Table = Record<string, string>;
type KVP = { key: string; value: string };

function getTransformedData(data: Table) {
	return Object.entries(data).map(([key, value]) => ({
		key,
		value,
	}));
}

function getUntransformedData(data: KVP[]) {
	return Object.fromEntries(data.map(({ key, value }) => [key, value]));
}

interface EditableFormTableProps {
	data: Table;
	setData: (data: Table) => void;
}

export function EditableFormTable({ data, setData }: EditableFormTableProps) {
	const [localDataState, setLocalDataState] = useDebounce({
		state: getTransformedData(data),
		setState: (d) => getDuplicateKeys(d).size === 0 && setData(getUntransformedData(d)),
	});

	const duplicateKeys = useMemo(() => getDuplicateKeys(localDataState), [localDataState]);

	return (
		<Sheet>
			<Table>
				<thead>
					<tr>
						<th style={{ maxWidth: '45%' }}>Name</th>
						<th style={{ width: '45%' }}>Value</th>
						<th style={{ width: '10%' }}></th>
					</tr>
				</thead>
				<tbody>
					{localDataState.map(({ key, value }, index) => (
						// TODO: we'll need a better way to key these without indexes, given duplicates can exist
						// eslint-disable-next-line @eslint-react/no-array-index-key
						<tr key={`${key}-${value}-${index}`}>
							<td>
								<Input
									value={key}
									error={key === '' || duplicateKeys.has(key)}
									onChange={(e) => {
										setLocalDataState((localDataState) => {
											const newData = structuredClone(localDataState);
											newData[index].key = e.target.value;
											return newData;
										});
									}}
								></Input>
							</td>
							<td>
								<Input
									value={value}
									onChange={(e) => {
										setLocalDataState((localDataState) => {
											const newData = structuredClone(localDataState);
											newData[index].value = e.target.value;
											return newData;
										});
									}}
								></Input>
							</td>
							<td>
								<SprocketTooltip text="Delete Entry">
									<IconButton
										color="danger"
										variant="outlined"
										onClick={() => {
											setLocalDataState((localDataState) => {
												const newData = structuredClone(localDataState);
												delete newData[index];
												return newData;
											});
										}}
									>
										<Delete />
									</IconButton>
								</SprocketTooltip>
							</td>
						</tr>
					))}
				</tbody>
				<SprocketTooltip text="Add New Entry">
					<IconButton
						onClick={() => setLocalDataState((localDataState) => [...localDataState, { key: '', value: '' }])}
					>
						<AddBox />
					</IconButton>
				</SprocketTooltip>
			</Table>
		</Sheet>
	);
}
