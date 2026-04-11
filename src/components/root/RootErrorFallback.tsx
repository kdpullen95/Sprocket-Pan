import { Container, Sheet } from '@mui/joy';
import type { FallbackProps } from 'react-error-boundary';
import { ErrorFallback } from '../shared/ErrorFallback';

export function RootErrorFallback(props: FallbackProps) {
	return (
		<Container sx={{ paddingTop: 4 }}>
			<Sheet sx={{ padding: 4 }}>
				<ErrorFallback {...props} />
			</Sheet>
		</Container>
	);
}
