import { useAppDispatch } from '@/state/store';
import { selectToast } from '@/state/ui/selectors';
import { uiActions } from '@/state/ui/slice';
import { Close, Info, Warning } from '@mui/icons-material';
import { ColorPaletteProp, Divider, IconButton, Snackbar, Stack, Typography } from '@mui/joy';
import { JSX } from 'react';
import { useSelector } from 'react-redux';

export interface ToastProps {
	title?: string;
	color?: ColorPaletteProp;
	details?: string | JSX.Element;
}

// this is intended for expansion into stacked/multi-toasts
// but for now only supports a single toast at a time.
export function Toasts() {
	const toast = useSelector(selectToast);
	const dispatch = useAppDispatch();
	return (
		<Snackbar
			sx={{ maxWidth: '900px' }}
			startDecorator={
				toast?.color === 'danger' || toast?.color === 'warning' ? (
					<Warning fontSize="large" />
				) : (
					<Info fontSize="large" />
				)
			}
			size="md"
			animationDuration={900}
			autoHideDuration={null}
			variant="soft"
			open={toast != null}
			color={toast?.color}
			onClose={(_event, reason) => {
				if (reason === 'clickaway') {
					return;
				}
				dispatch(uiActions.clearToast());
			}}
			endDecorator={
				<IconButton variant="soft" color={toast?.color} onClick={() => dispatch(uiActions.clearToast())}>
					<Close />
				</IconButton>
			}
		>
			<Stack
				gap={1}
				direction={'row'}
				sx={{
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
				divider={<Divider orientation="vertical" />}
			>
				<Typography level="body-md" color={toast?.color}>
					{toast?.title}
				</Typography>
				{toast?.details != null && (
					<>
						{typeof toast.details === 'string' ? (
							<>
								<Typography color={toast.color} level="body-sm">
									{toast.details}
								</Typography>
							</>
						) : (
							<>{toast.details}</>
						)}
					</>
				)}
			</Stack>
		</Snackbar>
	);
}
