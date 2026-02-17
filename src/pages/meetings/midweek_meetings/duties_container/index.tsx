import { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import NoSchedule from '@features/meetings/weekly_schedules/no_schedule';
import WeekScheduleHeader from '@features/meetings/weekly_schedules/week_schedule_header';
import WeekSelector from '@features/meetings/weekly_schedules/week_selector';
import Typography from '@components/typography';
import Divider from '@components/divider';
import PersonComponent from '@features/meetings/weekly_schedules/person_component';
import useDutiesContainer from './useDutiesContainer';

const WEEKLY_SCHEDULES_KEY = 'organized_weekly_schedules';

const DutiesContainer = () => {
  const { t } = useAppTranslation();

  const {
    handleGoCurrent,
    handleValueChange,
    value,
    week,
    currentWeekVisible,
    scheduleLastUpdated,
    noSchedule,
    dataView,
  } = useDutiesContainer();

  useEffect(() => {
    const curr = localStorage.getItem(WEEKLY_SCHEDULES_KEY);
    if (curr !== 'midweek') {
      localStorage.setItem(WEEKLY_SCHEDULES_KEY, 'midweek');
    }
  }, []);

  return (
    <>
      {noSchedule && <NoSchedule />}

      {!noSchedule && (
        <Box sx={{ marginTop: '8px' }}>
          <WeekSelector value={value} onChange={handleValueChange} />

          <WeekScheduleHeader
            currentVisible={currentWeekVisible}
            week={week}
            onCurrent={handleGoCurrent}
            lastUpdated={scheduleLastUpdated}
          />

          {week && (
            <Box
              sx={{
                borderRadius: 'var(--radius-xl)',
                padding: '16px',
                backgroundColor: 'var(--white)',
                border: '1px solid var(--accent-300)',
              }}
            >
              <Stack spacing="16px">
                <Stack spacing="12px">
                  <Typography className="h4">{t('tr_dutiesAudio')}</Typography>
                  <PersonComponent
                    label={t('tr_audio')}
                    week={week}
                    assignment="MW_DUTIES_Audio"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_video')}
                    week={week}
                    assignment="MW_DUTIES_Video"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_micro') + ' 5'}
                    week={week}
                    assignment="MW_DUTIES_Microphone_1"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_micro') + ' 6'}
                    week={week}
                    assignment="MW_DUTIES_Microphone_2"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_dutiesStage')}
                    week={week}
                    assignment="MW_DUTIES_Stage"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_dutiesVideoConference')}
                    week={week}
                    assignment="MW_DUTIES_VideoConference"
                    dataView={dataView}
                  />
                </Stack>

                <Divider color="var(--accent-200)" />

                <Stack spacing="12px">
                  <Typography className="h4">{t('tr_attendants')}</Typography>

                  <PersonComponent
                    label={t('tr_hallOverseer') + ' Turno 1'}
                    week={week}
                    assignment="MW_DUTIES_EntranceAttendant_Shift_1"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_hallOverseer') + ' Turno 2'}
                    week={week}
                    assignment="MW_DUTIES_EntranceAttendant_Shift_2"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_entranceAttendant') + ' Turno 1'}
                    week={week}
                    assignment="MW_DUTIES_AuditoriumAttendant_Shift_1"
                    dataView={dataView}
                  />
                  <PersonComponent
                    label={t('tr_entranceAttendant') + ' Turno 2'}
                    week={week}
                    assignment="MW_DUTIES_AuditoriumAttendant_Shift_2"
                    dataView={dataView}
                  />
                </Stack>
              </Stack>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default DutiesContainer;
