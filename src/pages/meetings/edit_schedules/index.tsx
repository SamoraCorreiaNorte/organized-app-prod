import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useEditSchedules from './useEditSchedules';
import PageTitle from '@components/page_title';
import FloatingTabs from '@components/floating_tabs';
import QuickSettingsMidweekMeeting from '@features/meetings/midweek_editor/quick_settings';
import MidweekExport from '@features/meetings/midweek_export';
import SchedulePublish from '@features/meetings/schedule_publish';
import ScheduleAutofillDialog from '@features/meetings/schedule_autofill';
import QuickSettingsWeekendMeeting from '@features/meetings/weekend_editor/quick_settings';
import WeekendExport from '@features/meetings/weekend_export';
import QuickSettingsMeetingDuties from '@features/meetings/duties_schedule/quick_settings';

const EditSchedules = () => {
  const { t } = useAppTranslation();

  const {
    value,
    handleScheduleChange,
    tabs,
    titleProps,
    midweekState,
    weekendState,
    dutiesState,
  } = useEditSchedules();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      {midweekState.quickSettingsOpen && (
        <QuickSettingsMidweekMeeting
          open={midweekState.quickSettingsOpen}
          onClose={midweekState.handleCloseQuickSettings}
        />
      )}

      {midweekState.openExport && (
        <MidweekExport
          open={midweekState.openExport}
          onClose={midweekState.handleCloseExport}
        />
      )}

      {midweekState.isConnected && midweekState.openPublish && (
        <SchedulePublish
          type="midweek"
          open={midweekState.openPublish}
          onClose={midweekState.handleClosePublish}
        />
      )}

      {midweekState.openAutofill && (
        <ScheduleAutofillDialog
          meeting="midweek"
          open={midweekState.openAutofill}
          onClose={midweekState.handleCloseAutofill}
        />
      )}

      {weekendState.quickSettingsOpen && (
        <QuickSettingsWeekendMeeting
          open={weekendState.quickSettingsOpen}
          onClose={weekendState.handleCloseQuickSettings}
        />
      )}

      {weekendState.openExport && (
        <WeekendExport
          open={weekendState.openExport}
          onClose={weekendState.handleCloseExport}
        />
      )}

      {weekendState.openAutofill && (
        <ScheduleAutofillDialog
          meeting="weekend"
          open={weekendState.openAutofill}
          onClose={weekendState.handleCloseAutofill}
        />
      )}

      {weekendState.isConnected && weekendState.openPublish && (
        <SchedulePublish
          type="weekend"
          open={weekendState.openPublish}
          onClose={weekendState.handleClosePublish}
        />
      )}

      {dutiesState.quickSettingsOpen && (
        <QuickSettingsMeetingDuties
          open={dutiesState.quickSettingsOpen}
          onClose={dutiesState.handleCloseQuickSettings}
        />
      )}

      <PageTitle {...titleProps} />

      <FloatingTabs
        indicatorMode
        tabs={tabs}
        value={value}
        onChange={handleScheduleChange}
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
  );
};

export default EditSchedules;
