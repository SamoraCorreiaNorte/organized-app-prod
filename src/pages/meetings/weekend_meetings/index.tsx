import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PageTitle from '@components/page_title';
import ScrollableTabs from '@components/scrollable_tabs';
import useWeekendMeetings from './useWeekendMeetings';

const WeekendMeetings = () => {
  const { t } = useAppTranslation();
  const { value, handleTabChange, tabs } = useWeekendMeetings();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_weekendMeeting')} />

      <Box
        sx={{
          backgroundColor: 'var(--white)',
          padding: '15px',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-l)',
        }}
      >
        <ScrollableTabs
          indicatorMode
          tabs={tabs}
          value={value}
          onChange={handleTabChange}
          sx={{
            '& button.Mui-selected': {
              color: 'var(--accent-main)',
              background: 'unset',
              borderRadius: 'unset',
            },
            '& span.MuiTouchRipple-root': { borderRadius: 'var(--radius-l)' },
          }}
        />
      </Box>
    </Box>
  );
};

export default WeekendMeetings;
