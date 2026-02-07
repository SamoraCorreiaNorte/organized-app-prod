import { Grid, Stack } from '@mui/material';
import { IconTalk } from '@components/icons';
import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { useAtomValue } from 'jotai';
import { selectedWeekState } from '@states/schedules';
import DutyName from '../duty_name';
import PersonSelector from '@features/meetings/person_selector';

type StageProps = {
  dayType: 'midweek' | 'weekend';
};

const Stage = ({ dayType }: StageProps) => {
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
        duty={t('tr_dutiesStage')}
        icon={<IconTalk color="var(--accent-dark)" />}
      />

      <Stack spacing="8px" flex={1} width="100%">
        <Grid container spacing="8px">
          <Grid size={{ mobile: 12, laptop: 6 }}>
            <PersonSelector
              label={t('tr_brother')}
              week={week}
              assignment={`${assignmentWeekType}_DUTIES_Stage`}
              type={AssignmentCode.DUTIES_Stage}
            />
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  );
};

export default Stage;
