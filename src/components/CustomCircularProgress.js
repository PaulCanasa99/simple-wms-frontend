import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const CustomCircularProgress = (props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', height: '200px' }}>
      <CircularProgress variant="determinate" {...props} size={200} sx={{zIndex: 1, color: 'primary.light'}}/>
      <CircularProgress
        thickness={props.thickness} 
        variant="determinate" 
        value={100}
        size={200}
        sx={{
          color: 'secondary.light',
          animationDuration: '550ms',
          position: 'absolute',
          left: 0
        }}/>
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Typography align='center' color="text.primary" fontSize={36}>
            {`${Math.round(props.value)}%`}
          </Typography>
          <Typography fontSize={12}>Espacios ocupados</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CustomCircularProgress;