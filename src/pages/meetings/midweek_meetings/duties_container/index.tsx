import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import NoSchedule from '@features/meetings/weekly_schedules/no_schedule';
import WeekScheduleHeader from '@features/meetings/weekly_schedules/week_schedule_header';
import WeekSelector from '@features/meetings/weekly_schedules/week_selector';
import Typography from '@components/typography';
import {
  IconAudioMixer,
  IconComputerVideo,
  IconMicrophone,
  IconConference,
  IconTalk,
  IconDoor,
  IconHallOverseer,
} from '@components/icons';
import useDutiesContainer from './useDutiesContainer';
import DutyRow from './components/DutyRow';
import DutyGroup from './components/DutyGroup';
import ShiftCard from './components/ShiftCard';
import Divider from '@components/divider';
import { WeeklySchedulesType } from '@features/meetings/weekly_schedules/week_selector/index.types';
import { AssignmentFieldType } from '@definition/assignment';

const BLUE = '#5d7bf1';
const GREEN = '#2da88e';

const DutiesContainer = ({
  meetingType,
}: {
  meetingType: WeeklySchedulesType;
}) => {
  const { t } = useAppTranslation();
  const { tablet600Down, laptop856Down, mobile400Down } = useBreakpoints();

  const {
    handleGoCurrent,
    handleValueChange,
    value,
    week,
    currentWeekVisible,
    scheduleLastUpdated,
    noSchedule,
    getAssignedInfo,
  } = useDutiesContainer(meetingType);

  const dutyPrefix = meetingType === 'weekend' ? 'WE' : 'MW';
  const getDutyAssignment = (suffix: string) =>
    `${dutyPrefix}_DUTIES_${suffix}` as AssignmentFieldType;
  const getDutyInfo = (suffix: string) =>
    getAssignedInfo(getDutyAssignment(suffix));

  const audioDuty = getDutyInfo('Audio');
  const videoDuty = getDutyInfo('Video');
  const microphone1Duty = getDutyInfo('Microphone_1');
  const microphone2Duty = getDutyInfo('Microphone_2');
  // const stageDuty = getDutyInfo('Stage');
  const videoConferenceDuty = getDutyInfo('VideoConference');
  const entranceShift1Duty = getDutyInfo('EntranceAttendant_Shift_1');
  const auditoriumShift1Duty = getDutyInfo('AuditoriumAttendant_Shift_1');
  const entranceShift2Duty = getDutyInfo('EntranceAttendant_Shift_2');
  const auditoriumShift2Duty = getDutyInfo('AuditoriumAttendant_Shift_2');

  return (
    <>
      {noSchedule && <NoSchedule />}

      {!noSchedule && (
        <Box sx={{ marginTop: '8px' }}>
          <WeekSelector
            value={value}
            onChange={handleValueChange}
            meetingType={meetingType}
          />

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
                    personName={audioDuty.name}
                    isActive={audioDuty.active}
                    color={BLUE}
                  />
                  <DutyRow
                    icon={
                      <IconComputerVideo color={BLUE} width={20} height={20} />
                    }
                    label={t('tr_video')}
                    personName={videoDuty.name}
                    isActive={videoDuty.active}
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
                    personName={microphone1Duty.name}
                    isActive={microphone1Duty.active}
                    color={BLUE}
                  />
                  <DutyRow
                    icon={
                      <IconMicrophone color={BLUE} width={20} height={20} />
                    }
                    label="Micro 6"
                    personName={microphone2Duty.name}
                    isActive={microphone2Duty.active}
                    color={BLUE}
                  />
                </DutyGroup>
                {/* 
                {/* Palco }
                <DutyGroup>
                  <DutyRow
                    icon={<IconTalk color={BLUE} width={20} height={20} />}
                    label={t('tr_stage')}
                    personName={stageDuty.name}
                    isActive={stageDuty.active}
                    color={BLUE}
                  />
                </DutyGroup> */}

                {/* Video conferência */}
                <DutyGroup>
                  <DutyRow
                    icon={
                      <IconConference color={BLUE} width={20} height={20} />
                    }
                    label={t('tr_dutiesVideoConference')}
                    personName={videoConferenceDuty.name}
                    isActive={videoConferenceDuty.active}
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
                    gap: mobile400Down ? '.5rem' : '.75rem',
                    flexDirection: laptop856Down ? 'column' : 'row',
                  }}
                >
                  {/* Turno 1 */}
                  <ShiftCard title="Turno 1">
                    <DutyRow
                      icon={<IconDoor color={GREEN} width={20} height={20} />}
                      label="Hall"
                      personName={entranceShift1Duty.name}
                      isActive={entranceShift1Duty.active}
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
                      personName={auditoriumShift1Duty.name}
                      isActive={auditoriumShift1Duty.active}
                      color={GREEN}
                    />
                  </ShiftCard>

                  {/* Turno 2 */}
                  <ShiftCard title="Turno 2" color={GREEN}>
                    <DutyRow
                      icon={<IconDoor color={GREEN} width={20} height={20} />}
                      label="Hall"
                      personName={entranceShift2Duty.name}
                      isActive={entranceShift2Duty.active}
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
                      personName={auditoriumShift2Duty.name}
                      isActive={auditoriumShift2Duty.active}
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
