import { globalActions } from '@/state/global/slice';
import { useAppDispatch } from '@/state/store';
import { WorkspaceMetadata } from '@/types/data/workspace';
import { formatFullDate } from '@/utils/string';
import { Delete, EditCalendar, Info, OpenInNew } from '@mui/icons-material';
import { Button, Card, Stack, Typography } from '@mui/joy';
import { EllipsisTypography } from '../shared/EllipsisTypography';
import { GradientBorderBoundingBox } from '../shared/flair/GradientBorderBoundingBox';
import { TextAvatar } from '../shared/flair/Minidenticon';
import { SprocketTooltip } from '../shared/SprocketTooltip';

interface WorkspaceEntryProps {
	workspace: WorkspaceMetadata;
	onDelete: (workspace: WorkspaceMetadata) => void;
}

export function WorkspaceEntry({ workspace, onDelete }: WorkspaceEntryProps) {
	const dispatch = useAppDispatch();
	function deleteWorkspace() {
		onDelete(workspace);
	}
	function openWorkspace() {
		dispatch(globalActions.setSelectedWorkspace(workspace));
	}
	return (
		<Card
			sx={{
				overflow: 'hidden',
				height: 200,
				width: 400,
				'--Card-radius': (theme) => theme.vars.radius.xs,
			}}
		>
			<Stack gap={2}>
				<Stack direction="row" gap={2} alignItems="center">
					<GradientBorderBoundingBox>
						<TextAvatar
							username={workspace.minidenticon}
							size="md"
							sx={{ p: 0.5, border: '2px solid', borderColor: 'background.body' }}
						/>
					</GradientBorderBoundingBox>
					<EllipsisTypography level="title-lg">{workspace.name}</EllipsisTypography>
				</Stack>
				<Stack gap={1} ml={1}>
					<Stack direction="row" gap={1} alignItems="center">
						<SprocketTooltip text="Last Modified">
							<EditCalendar />
						</SprocketTooltip>
						<Typography level="body-md"> {formatFullDate(new Date(workspace.lastModified))}</Typography>
					</Stack>
					<Stack direction="row" gap={1} alignItems="center">
						<SprocketTooltip text="Description">
							<Info />
						</SprocketTooltip>
						<EllipsisTypography level="body-sm">{workspace.description}</EllipsisTypography>
					</Stack>
				</Stack>
				<Stack justifyContent="space-between" direction="row" gap={6} ml="-2px">
					<Button variant="plain" color="danger" startDecorator={<Delete />} onClick={deleteWorkspace}>
						Delete
					</Button>
					<Button sx={{ width: '100%' }} variant="outlined" startDecorator={<OpenInNew />} onClick={openWorkspace}>
						Open
					</Button>
				</Stack>
			</Stack>
		</Card>
	);
}
