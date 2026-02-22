import { Grid, Stack } from '@mui/material';
import { IconMicrophone } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { useAtomValue } from 'jotai';
import { selectedWeekState } from '@states/schedules';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';

type MicrophonesProps = {
  dayType: 'midweek' | 'weekend';
};

const Microphones = ({ dayType }: MicrophonesProps) => {
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
        duty={t('tr_dutiesMicrophones')}
        icon={<IconMicrophone color="var(--accent-dark)" />}
      />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container spacing="8px">
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment={`${assignmentWeekType}_DUTIES_Microphone_1`}
              type={AssignmentCode.DUTIES_Microphone}
            />
          </Grid>
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment={`${assignmentWeekType}_DUTIES_Microphone_2`}
              type={AssignmentCode.DUTIES_Microphone}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default Microphones;
