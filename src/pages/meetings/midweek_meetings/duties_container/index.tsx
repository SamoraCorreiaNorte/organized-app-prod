import { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import NoSchedule from '@features/meetings/weekly_schedules/no_schedule';
import WeekScheduleHeader from '@features/meetings/weekly_schedules/week_schedule_header';
import WeekSelector from '@features/meetings/weekly_schedules/week_selector';
import Typography from '@components/typography';
import {
  IconAudioMixer,
  IconComputerVideo,
  IconMicrophone,
  IconGroups,
  IconConference,
  IconCorporateFare,
  IconTalk,
  IconDoor,
  IconHallOverseer,
} from '@components/icons';
import useDutiesContainer from './useDutiesContainer';
import DutyRow from './components/DutyRow';
import DutyGroup from './components/DutyGroup';
import ShiftCard from './components/ShiftCard';
import Divider from '@components/divider';

const WEEKLY_SCHEDULES_KEY = 'organized_weekly_schedules';

const BLUE = '#5d7bf1';
const GREEN = '#2da88e';

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
    getAssignedName,
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
            <Stack spacing="18px">
              {/* ── SOM Section ── */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '.75rem',
                  flexDirection: 'column',
                }}
              >
                <Typography className="h3" color={BLUE}>
                  SOM
                </Typography>

                {/* Áudio + Vídeo */}
                <DutyGroup>
                  <DutyRow
                    icon={
                      <IconAudioMixer color={BLUE} width={20} height={20} />
                    }
                    label={t('tr_audio')}
                    personName={getAssignedName('MW_DUTIES_Audio')}
                    color={BLUE}
                  />
                  <DutyRow
                    icon={
                      <IconComputerVideo color={BLUE} width={20} height={20} />
                    }
                    label={t('tr_video')}
                    personName={getAssignedName('MW_DUTIES_Video')}
                    color={BLUE}
                  />
                </DutyGroup>

                {/* Micro 5 + Micro 6 */}
                <DutyGroup>
                  <DutyRow
                    icon={
                      <IconMicrophone color={BLUE} width={20} height={20} />
                    }
                    label="Micro 5"
                    personName={getAssignedName('MW_DUTIES_Microphone_1')}
                    color={BLUE}
                  />
                  <DutyRow
                    icon={
                      <IconMicrophone color={BLUE} width={20} height={20} />
                    }
                    label="Micro 6"
                    personName={getAssignedName('MW_DUTIES_Microphone_2')}
                    color={BLUE}
                  />
                </DutyGroup>

                {/* Palco */}
                <DutyGroup>
                  <DutyRow
                    icon={<IconTalk color={BLUE} width={20} height={20} />}
                    label={t('tr_stage')}
                    personName={getAssignedName('MW_DUTIES_Stage')}
                    color={BLUE}
                  />
                </DutyGroup>

                {/* Video conferência */}
                <DutyGroup>
                  <DutyRow
                    icon={
                      <IconConference color={BLUE} width={20} height={20} />
                    }
                    label={t('tr_dutiesVideoConference')}
                    personName={getAssignedName('MW_DUTIES_VideoConference')}
                    color={BLUE}
                  />
                </DutyGroup>
              </Box>

              <Divider color="var(--accent-200)" />

              <Box
                sx={{
                  display: 'flex',
                  gap: '.75rem',
                  flexDirection: 'column',
                }}
              >
                <Typography className="h3" color={GREEN}>
                  INDICADORES
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: '.75rem',
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Turno 1 */}
                  <ShiftCard title="Turno 1">
                    <DutyRow
                      icon={<IconDoor color={GREEN} width={20} height={20} />}
                      label="Hall"
                      personName={getAssignedName(
                        'MW_DUTIES_EntranceAttendant_Shift_1'
                      )}
                      color={GREEN}
                    />
                    <DutyRow
                      icon={
                        <IconHallOverseer
                          color={GREEN}
                          width={20}
                          height={20}
                        />
                      }
                      label="Auditório"
                      personName={getAssignedName(
                        'MW_DUTIES_AuditoriumAttendant_Shift_1'
                      )}
                      color={GREEN}
                    />
                  </ShiftCard>

                  {/* Turno 2 */}
                  <ShiftCard title="Turno 2" color={GREEN}>
                    <DutyRow
                      icon={<IconDoor color={GREEN} width={20} height={20} />}
                      label="Hall"
                      personName={getAssignedName(
                        'MW_DUTIES_EntranceAttendant_Shift_2'
                      )}
                      color={GREEN}
                    />
                    <DutyRow
                      icon={
                        <IconHallOverseer
                          color={GREEN}
                          width={20}
                          height={20}
                        />
                      }
                      label="Auditório"
                      personName={getAssignedName(
                        'MW_DUTIES_AuditoriumAttendant_Shift_2'
                      )}
                      color={GREEN}
                    />
                  </ShiftCard>
                </Box>
              </Box>
            </Stack>
          )}
        </Box>
      )}
    </>
  );
};

export default DutiesContainer;
