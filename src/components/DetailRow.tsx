import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
}

export const DetailRow = ({ label, value, children }: Props) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" my="10px">
    <Typography fontSize={18} fontWeight={700}>
      {label}
    </Typography>
    {value !== undefined && value !== null && <Typography fontSize={18}>{value}</Typography>}
    {children}
  </Box>
);
