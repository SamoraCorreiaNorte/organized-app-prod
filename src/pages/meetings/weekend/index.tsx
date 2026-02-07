import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import OutgoingTalks from '@features/meetings/outgoing_talks';
import WeekendEditor from '@features/meetings/weekend_editor';
import WeekSelector from '@features/meetings/week_selector';

const WeekendMeeting = () => {
  const { desktopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <WeekSelector />

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <WeekendEditor />
          <OutgoingTalks />
        </Box>
      </Box>
    </Box>
  );
};

export default WeekendMeeting;
