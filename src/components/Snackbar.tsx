import { forwardRef } from 'react';
import { Snackbar as MuiSnackbar, Alert as MuiAlert, type AlertColor } from '@mui/material';

export interface AlertState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export const emptyAlert: AlertState = { open: false, message: '', severity: 'info' };

const Alert = forwardRef<HTMLDivElement, React.ComponentProps<typeof MuiAlert>>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  },
);

interface Props {
  alert: AlertState;
  onClose: () => void;
}

export const Snackbar = ({ alert, onClose }: Props) => {
  const handleClose = (_e: unknown, reason?: string) => {
    if (reason === 'clickaway') return;
    onClose();
  };

  return (
    <MuiSnackbar open={alert.open} onClose={handleClose} autoHideDuration={6000}>
      <Alert severity={alert.severity} onClose={() => onClose()} sx={{ width: '100%' }}>
        {alert.message}
      </Alert>
    </MuiSnackbar>
  );
};
