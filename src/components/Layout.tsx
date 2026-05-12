import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Navbar } from './Navbar';
import { DemoBanner } from './DemoBanner';

export const Layout = ({
  children,
  demoMode,
}: {
  children: ReactNode;
  demoMode: boolean;
}) => (
  <Box minHeight="100vh">
    <Navbar />
    {demoMode ? <DemoBanner /> : null}
    {children}
  </Box>
);
