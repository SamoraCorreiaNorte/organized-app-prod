import { Box } from '@mui/material';
import { useBreakpoints } from '@hooks/index';
import MidweekEditor from '@features/meetings/midweek_editor';
import MonthlyView from '@features/meetings/monthly_view';
import WeekSelector from '@features/meetings/week_selector';

const MidweekMeetingSchedule = ({
  openWeekView,
}: {
  openWeekView: boolean;
}) => {
  const { desktopUp } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      {openWeekView ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: desktopUp ? 'row' : 'column',
            gap: '16px',
            alignItems: desktopUp ? 'flex-start' : 'unset',
          }}
        >
          <WeekSelector meetingType="midweek" />
          <MidweekEditor />
        </Box>
      ) : (
        <MonthlyView />
      )}
    </Box>
  );
};

export default MidweekMeetingSchedule;
