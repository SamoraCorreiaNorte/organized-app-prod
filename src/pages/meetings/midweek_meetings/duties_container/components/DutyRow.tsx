import { ReactNode } from 'react';
import { Box, alpha } from '@mui/material';
import Typography from '@components/typography';
import { IconPerson } from '@components/icons';

interface DutyRowProps {
  icon: ReactNode;
  label: string;
  personName: string;
  color?: string;
}

const DutyRow = ({
  icon,
  label,
  personName,
  color = '#5d7bf1',
}: DutyRowProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '.75rem',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '.5rem',
          alignItems: 'center',
          backgroundColor: alpha(color, 0.15),
          color: color,
          borderRadius: 'var(--radius-xl)',
          padding: '.5rem .75rem',
          minWidth: '8rem',
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
          padding: '.5rem .75rem',
          minWidth: '8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '.5rem',
          flex: 1,
        }}
      >
        <IconPerson color="var(--grey-350)" width={20} height={20} />
        <Typography>{personName}</Typography>
      </Box>
    </Box>
  );
};

export default DutyRow;
