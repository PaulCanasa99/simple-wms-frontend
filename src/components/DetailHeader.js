import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const DetailHeader = (props) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' m={'10px 0'}>
      <Typography fontSize={18} fontWeight={700}>{props.label}</Typography>
      {props.value && <Typography fontSize={18}>{props.value}</Typography>}
      {props.children}
    </Box>
  );
}

export default DetailHeader;