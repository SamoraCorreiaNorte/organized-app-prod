import { ReactNode } from 'react';
import { Box, alpha } from '@mui/material';
import Typography from '@components/typography';
import { IconPerson } from '@components/icons';
import useBreakpoints from '@hooks/useBreakpoints';

interface DutyRowProps {
  icon: ReactNode;
  label: string;
  personName: string;
  color?: string;
  isActive?: boolean;
}

const DutyRow = ({
  icon,
  label,
  personName,
  color = '#5d7bf1',
  isActive = false,
}: DutyRowProps) => {
  const { tablet600Down, mobile400Down } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: mobile400Down ? '.5rem' : '.75rem',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: mobile400Down ? '.25rem' : '.5rem',
          alignItems: 'center',
          backgroundColor: alpha(color, 0.15),
          color: color,
          borderRadius: 'var(--radius-xl)',
          border: `1px solid ${alpha(color, 0.2)}`,
          padding: mobile400Down
            ? '.5rem .25rem'
            : tablet600Down
              ? '.5rem'
              : '.5rem .75rem',
          minWidth: tablet600Down ? '7rem' : '8rem',
        }}
      >
        {icon}
        <Typography color="inherit">{label}</Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: 'rgba(var(--accent-150-base), 0.15)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--accent-125)',
          padding: mobile400Down
            ? '.5rem .25rem'
            : tablet600Down
              ? '.5rem'
              : '.5rem .75rem',
          minWidth: tablet600Down ? '7rem' : '8rem',
          display: 'flex',
          alignItems: 'center',
          gap: mobile400Down ? '.25rem' : '.5rem',
          flex: 1,
          ...(isActive && {
            border: '1px solid var(--accent-click)',
            backgroundColor: 'var(--accent-150)',
          }),
        }}
      >
        <IconPerson color="var(--grey-350)" width={20} height={20} />
        <Typography>{personName}</Typography>
      </Box>
    </Box>
  );
};

export default DutyRow;
