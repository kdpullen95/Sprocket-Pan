import { getEditorTheme } from '@/utils/style';
import { useColorScheme } from '@mui/joy/styles';

export function useEditorTheme() {
	return getEditorTheme(useColorScheme());
}
