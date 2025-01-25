import { selectIsLoading } from '@/state/ui/selectors';
import { Stack, CircularProgress } from '@mui/joy';
import { useSelector } from 'react-redux';

export function LoadingOverlay() {
	const isLoading = useSelector(selectIsLoading);

	return (
		<Stack
			alignItems="center"
			justifyContent="center"
			sx={{
				position: 'absolute',
				pointerEvents: isLoading ? 'all' : 'none',
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1995,
				backdropFilter: 'blur(10px)',
				backgroundColor: 'rgba(0,0,0,0.1)',
				transition: 'all 1s ease-in-out',
				opacity: isLoading ? 1 : 0,
			}}
		>
			<CircularProgress
				sx={{
					'--CircularProgress-size': '250px',
					'--CircularProgress-trackThickness': '20px',
					'--CircularProgress-progressThickness': '20px',
				}}
				variant="solid"
			/>
		</Stack>
	);
}
