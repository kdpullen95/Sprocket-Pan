import { TabType } from '@/types/state/state';
import { Workspaces } from '@mui/icons-material';
import CodeIcon from '@mui/icons-material/Code';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FolderOpenSharpIcon from '@mui/icons-material/FolderOpenSharp';
import KeyIcon from '@mui/icons-material/Key';
import TableChartIcon from '@mui/icons-material/TableChart';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import { ReactNode } from 'react';

export const tabTypeIcon: Record<TabType, ReactNode> = {
	endpoint: <FolderOpenIcon />,
	environment: <TableChartIcon />,
	request: <TextSnippetIcon />,
	service: <FolderOpenSharpIcon />,
	script: <CodeIcon />,
	secrets: <KeyIcon />,
	workspace: <Workspaces />,
};
