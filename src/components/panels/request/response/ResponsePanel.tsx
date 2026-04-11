import { SprocketTooltip } from '@/components/shared/SprocketTooltip';
import { ActiveSelect } from '@/state/active/selectors';
import { ActiveActions } from '@/state/active/slice';
import { useAppDispatch } from '@/state/store';
import type { EndpointRequest } from '@/types/data/workspace';
import { clamp } from '@/utils/math';
import { formatFullDate } from '@/utils/string';
import { DeleteForever } from '@mui/icons-material';
import { IconButton, Stack, Typography } from '@mui/joy';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HistoryControl } from './HistoryControl';
import { OpenDiffToolButton } from './OpenDiffToolButton';
import { ResponseInfo } from './ResponseInfo';

interface ResponsePanelProps {
	request: EndpointRequest;
}

export function ResponsePanel({ request }: ResponsePanelProps) {
	const dispatch = useAppDispatch();
	const history = useSelector((state) => ActiveSelect.historyById(state, request.id));
	const [index, setIndex] = useState(history.length - 1);
	const boundedIndex = clamp(index, 0, history.length - 1);
	const data = history[boundedIndex];

	useEffect(() => {
		// whenever the history changes, jump to the front
		setIndex(history.length - 1);
	}, [history]);

	if (data == null) {
		return (
			<Stack justifyContent="center" alignItems="center" pt={8} height="100%" width="100%">
				<Typography level="title-md">No Response Data Available</Typography>
				<Typography>Make a request to see the response here!</Typography>
			</Stack>
		);
	}

	return (
		<>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<Stack direction="row" gap={0} alignItems="center">
					<SprocketTooltip text="Delete Response">
						<IconButton
							disabled={history.length === 0}
							aria-label="Delete Response"
							onClick={() => {
								dispatch(
									ActiveActions.deleteResponseFromHistory({ requestId: request.id, historyIndex: boundedIndex }),
								);
							}}
						>
							<DeleteForever />
						</IconButton>
					</SprocketTooltip>
					<Typography level="title-md" textAlign="center">
						{data.response?.dateTime == null ? 'N/A' : formatFullDate(data.response.dateTime)}
					</Typography>
				</Stack>
				<Stack direction="row" gap={0}>
					<HistoryControl value={boundedIndex} onChange={setIndex} historyLength={history.length} />
					<OpenDiffToolButton historyIndex={boundedIndex} id={request.id} />
				</Stack>
			</Stack>
			<ResponseInfo data={data} requestId={request.id} />
		</>
	);
}
