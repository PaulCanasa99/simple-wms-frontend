import { Button, CircularProgress, type ButtonProps } from '@mui/material';
import type { ReactNode } from 'react';

interface Props extends Omit<ButtonProps, 'startIcon'> {
  loading?: boolean;
  startIcon?: ReactNode;
}

export const LoadingButton = ({
  loading,
  startIcon,
  disabled,
  children,
  ...rest
}: Props) => (
  <Button
    {...rest}
    disabled={loading || disabled}
    startIcon={
      loading ? <CircularProgress size={16} color="inherit" /> : startIcon
    }
  >
    {children}
  </Button>
);
