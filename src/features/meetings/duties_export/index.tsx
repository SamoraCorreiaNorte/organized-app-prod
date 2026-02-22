import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { DutiesExportProps } from './index.types';
import useDutiesExport from './useDutiesExport';
import Button from '@components/button';
import Dialog from '@components/dialog';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import YearContainer from '../schedule_publish/year_container';
import IconLoading from '@components/icon_loading';

const DutiesExport = ({ open, onClose }: DutiesExportProps) => {
  const { t } = useAppTranslation();

  const {
    department,
    setDepartment,
    schedulesList,
    handleCheckedChange,
    handleExportSchedule,
    isProcessing,
  } = useDutiesExport(onClose);

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
          <Typography className="h2">Meeting duties export</Typography>
          <Typography color="var(--grey-400)">
            Select a department and months to download a duties PDF.
          </Typography>
        </Box>

        <Select
          label="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value as typeof department)}
        >
          <MenuItem value="som">Som</MenuItem>
          <MenuItem value="indicadores">Indicadores</MenuItem>
        </Select>

        <Stack direction="row" spacing="24px" sx={{ width: '100%' }}>
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
          endIcon={isProcessing && <IconLoading />}
          onClick={handleExportSchedule}
        >
          {t('tr_export')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default DutiesExport;
