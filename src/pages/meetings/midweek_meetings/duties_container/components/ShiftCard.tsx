import { ReactNode } from 'react';
import { Box, alpha } from '@mui/material';
import Typography from '@components/typography';
import { IconClock } from '@components/icons';

interface TurnoCardProps {
  title: string;
  children: ReactNode;
  color?: string;
}

const ShiftCard = ({ title, children, color = '#2da88e' }: TurnoCardProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--accent-100)',
        overflow: 'hidden',
        flex: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: '.5rem',
          alignItems: 'center',
          backgroundColor: alpha(color, 0.2),
          color: color,
          padding: '.5rem .75rem',
          width: '100%',
          borderBottom: `1px solid var(--accent-300)`,
        }}
      >
        <IconClock color={color} width={18} height={18} />
        <Typography
          className="body-small-semibold"
          color="inherit"
          sx={{ textTransform: 'uppercase', letterSpacing: '.5px' }}
        >
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '.75rem',
          padding: '.75rem',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ShiftCard;
