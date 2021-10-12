import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CustomSnackbar = ( props ) => {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    
    props.setAlert({
      ...props.alert,
      isOpen: false
    })
  }

  return (
    <Snackbar
      open={props.alert.isOpen}
      onClose={handleClose}
      autoHideDuration={6000}
    >
      <Alert 
        severity={props.alert.type}
        onClose={handleClose}
        sx={{ width: '100%' }}
      >
        {props.alert.message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar;