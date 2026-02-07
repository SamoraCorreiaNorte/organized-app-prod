import { Grid, Stack } from '@mui/material';
import { IconConference } from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { useAtomValue } from 'jotai';
import { selectedWeekState } from '@states/schedules';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';

type VideoConferenceProps = {
  dayType: 'midweek' | 'weekend';
};

const VideoConference = ({ dayType }: VideoConferenceProps) => {
  const { t } = useAppTranslation();

  const { laptopDown } = useBreakpoints();

  const week = useAtomValue(selectedWeekState);

  const assignmentWeekType = dayType === 'midweek' ? 'MW' : 'WE';

  return (
    <Stack
      spacing={laptopDown ? '24px' : '8px'}
      direction={laptopDown ? 'column' : 'row'}
      alignItems="flex-start"
    >
      <DutyName
        duty={t('tr_dutiesVideoConference')}
        icon={<IconConference color="var(--accent-dark)" />}
      />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container spacing="8px">
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment={`${assignmentWeekType}_DUTIES_VideoConference`}
              type={AssignmentCode.DUTIES_VideoConference}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default VideoConference;
