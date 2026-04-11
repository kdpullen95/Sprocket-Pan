import type { TabType } from '@/types/state/state';
import { Code, FolderOpen, FolderOpenSharp, Key, TableChart, TextSnippet, Workspaces } from '@mui/icons-material';
import type { ReactNode } from 'react';

export const tabTypeIcon: Record<TabType, ReactNode> = {
	endpoint: <FolderOpen />,
	environment: <TableChart />,
	request: <TextSnippet />,
	service: <FolderOpenSharp />,
	script: <Code />,
	secrets: <Key />,
	workspace: <Workspaces />,
};
