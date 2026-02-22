import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DutiesPublishProps } from './index.types';
import useDutiesPublish from './useDutiesPublish';
import Button from '@components/button';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import YearContainer from '../schedule_publish/year_container';
import IconLoading from '@components/icon_loading';

const DutiesPublishDialog = ({ open, onClose }: DutiesPublishProps) => {
  const { t } = useAppTranslation();

  const {
    schedulesList,
    handleCheckedChange,
    handlePublishSchedule,
    isProcessing,
  } = useDutiesPublish(onClose);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      sx={{ padding: '24px', position: 'relative' }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '24px',
          flexDirection: 'column',
          width: '100%',
          marginBottom: '110px',
          overflow: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h3">Publish meeting duties</Typography>
          <Typography color="var(--grey-400)">
            Meeting duties are published with the midweek and weekend schedules.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing="24px"
          sx={{ width: '100%', overflow: 'auto' }}
        >
          {schedulesList.map((schedule) => (
            <YearContainer
              key={schedule.year}
              data={schedule}
              onChange={handleCheckedChange}
              monthSeparator="/"
            />
          ))}
        </Stack>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          position: 'absolute',
          bottom: 0,
          right: 0,
          padding: '24px',
        }}
      >
        <Button
          variant="main"
          disabled={isProcessing}
          onClick={handlePublishSchedule}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_publish')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DutiesPublishDialog;
