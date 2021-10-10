import { Container, Divider, Grid, Typography } from '@mui/material';
import CustomCircularProgress from '../../components/CustomCircularProgress';
import { Box } from '@mui/system';
import React from 'react';
import { useNavigate } from "@reach/router"

const maxX = 16;
const maxY = 16;



const Almacen = () => {
  const map = [];
  const navigate = useNavigate();

  const getLetter = (index) => {
    if (index === 0) return '';
    return String.fromCharCode(64 + index);
  }

  const viewRack = (i, j) => {
    navigate(`almacen/${getLetter(i)}${getLetter(j+1)}`, {replace: true})
  }

  for (let i = 0; i < maxX; i++) {
    const squareRows = [];
    for (let j = 0; j < maxY ; j++) {
      i === 0 ?
      squareRows.push(
        <Box sx={{m: j%2 ? '2px 40px 2px 2px' : '2px', height: 25, width: 25, mb: 2}} onClick={() => viewRack(i,j)}>
          <Typography fontSize={24} fontWeight={600} color={'white'} align='center'>{getLetter(j+1)}</Typography>
        </Box>
      )
      :
      squareRows.push(
        <Box sx={{m: j%2 ? '2px 40px 2px 2px' : '2px', height: 25, width: 25, bgcolor: 'primary.main'}} onClick={() => viewRack(i,j)}/>
      )
    }
    map.push(
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography fontSize={24} fontWeight={600} color={'white'} lineHeight={1} mr={4} width={10}>{getLetter(i)}</Typography>
        {squareRows}
      </Box>
    );
  }

  return (
    <Container
      sx={{ paddingTop: "40px" }}
      maxWidth="xl"
    >
      <Typography variant="h4">Almacén</Typography>
      <Grid container sx={{pt: 5}}>
        <Grid item xs={9}>
          <Box sx={{ p: 3, mb: 5, width: '30%', border: '1px solid', borderColor: 'secondary.light'}}>
            <Typography sx={{color: 'white', fontSize: 14}}>Zona de recepción y despacho</Typography>
          </Box>
          <Box>
            {map}
          </Box>
        </Grid>
        <Grid item xs={3} sx={{bgcolor: 'white', borderRadius: '5px'}}>
          <Box item xs={10} sx={{p: 2, bgcolor: 'primary.main', textAlign: 'center', borderRadius: '5px 5px 0px 0px'}}>
            <Typography sx={{fontWeight: '600', color: 'white'}}>Estado</Typography>
          </Box>
          <Box sx={{height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CustomCircularProgress value={55} thickness={3}/>
          </Box>
          <Divider variant='middle' sx={{bgcolor: 'secondary.light'}}/>
          <Box sx={{p: '20px 30px'}}>
            <Typography sx={{fontSize: 14, fontWeight: '500', mb: 1}}>Unidades a recepcionar</Typography>
            <Typography sx={{fontSize: 14, fontWeight: '500', mb: 1}}>Unidades a despachar</Typography>
            <Typography sx={{fontSize: 14, fontWeight: '500', mb: 1}}>Unidades en tránsito</Typography>
            <Typography sx={{fontSize: 14, fontWeight: '500', mb: 1}}>Espacios libres</Typography>
            <Typography sx={{fontSize: 14, fontWeight: '500', mb: 1}}>Espacios ocupados</Typography>
            <Typography sx={{fontSize: 14, fontWeight: '700', mb: 1}}>Espacios en total</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Almacen;