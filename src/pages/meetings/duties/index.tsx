import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import DutiesEditor from '@features/meetings/duties_schedule/duties_editor';
import WeekSelector from '@features/meetings/duties_schedule/week_selector';

const MeetingDuties = () => {
  const { desktopUp } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <WeekSelector meetingType="duties" />
        <DutiesEditor />
      </Box>
    </Box>
  );
};

export default MeetingDuties;
