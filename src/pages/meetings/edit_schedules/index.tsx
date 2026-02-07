import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useEditSchedules from './useEditSchedules';
import PageTitle from '@components/page_title';
import FloatingTabs from '@components/floating_tabs';

const EditSchedules = () => {
  const { t } = useAppTranslation();

  const { value, handleScheduleChange, tabs } = useEditSchedules();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle title={t('tr_editSchedules')} />

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
