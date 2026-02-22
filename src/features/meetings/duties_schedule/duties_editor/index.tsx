import { Box, Stack } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useDutiesEditor from './useDutiesEditor';
import AudioVideo from '../audio_video';
import AuditoriumAttendant from '../auditorium_attendant';
import Divider from '@components/divider';
import EntranceAttendant from '../entrance_attendant';
import Microphones from '../microphones';
import Stage from '../stage';
import Typography from '@components/typography';
import VideoConference from '../video_conference';

const DutiesEditor = () => {
  const { t } = useAppTranslation();

  const { weekDateLocale, dayType } = useDutiesEditor();

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        flexGrow: 1,
      }}
    >
      {' '}
      {weekDateLocale?.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <IconInfo color="var(--accent-400)" />
          <Typography color="var(--grey-400)">
            {t('tr_infoPlanMidweekMeeting')}
          </Typography>
        </Box>
      )}
      {weekDateLocale?.length > 0 && (
        <Stack spacing="16px">
          {/* audio video duties */}

          <Typography className="h2" sx={{ flex: 1 }}>
            {`${weekDateLocale} - ${dayType === 'weekend' ? t('tr_weekend') : t('tr_midweek')}`}
          </Typography>

          <Divider color="var(--accent-200)" />

          <Stack spacing="20px">
            <Typography className="h4">{t('tr_dutiesAudio')}</Typography>
            <AudioVideo dayType={dayType} />
            <Microphones dayType={dayType} />
            <Stage dayType={dayType} />
            <VideoConference dayType={dayType} />
          </Stack>

          <Divider color="var(--accent-200)" />

          {/* attendants duties */}
          <Stack spacing="20px">
            <Typography className="h4">{t('tr_attendants')}</Typography>
            <EntranceAttendant dayType={dayType} />
            <AuditoriumAttendant dayType={dayType} />
          </Stack>

          {/* other duties */}
          {/* <Stack spacing="12px">
            <Typography className="h4">{t('tr_otherPart')}</Typography>
            <Hospitality />
          </Stack> */}
        </Stack>
      )}
    </Box>
  );
};

export default DutiesEditor;
