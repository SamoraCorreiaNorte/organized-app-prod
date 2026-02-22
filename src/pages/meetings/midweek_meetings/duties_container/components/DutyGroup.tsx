import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface DutyGroupProps {
  children: ReactNode;
}

const DutyGroup = ({ children }: DutyGroupProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '.75rem',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '.75rem',
        backgroundColor: 'var(--accent-100)',
      }}
    >
      {children}
    </Box>
  );
};

export default DutyGroup;
