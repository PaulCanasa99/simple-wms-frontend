import { Container, Divider, Grid, Typography } from '@mui/material';
import CustomCircularProgress from '../../components/CustomCircularProgress';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "@reach/router"
import axios from "axios";

const maxX = 17;
const maxY = 16;

const Almacen = () => {
  const map = [];
  const navigate = useNavigate();
  const [locations, setLocations] = useState();
  const [handlingUnits, setHandlingUnits] = useState();

  const getLetter = (index) => {
    if (index === 0) return '';
    return String.fromCharCode(64 + index);
  }

  const getRackLocations = (i, j) => {
    const rackLocations = locations?.filter((location) => location.handlingUnit && location.code.startsWith(`${getLetter(i)}${getLetter(j)}`))
    return rackLocations ?? [];
  }

  const getRackLocationsColor = (i, j) => {
    const rackLocations = getRackLocations(i,j);
    if(rackLocations.length === 6)
      return '#214D5B';
    else if (rackLocations.length === 0)
      return 'white';   
    else
      return '#C3E8F8';
  }

  const viewRack = (i, j) => {
    navigate(`almacen/${getLetter(i)}${getLetter(j+1)}`);
  }

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/locations`).then((r) => {
      setLocations(r.data);
    });
    const interval = setInterval(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/locations`).then((r) => {
        setLocations(r.data);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/handlingUnits`).then((r) => {
      setHandlingUnits(r.data);
    });
  }, []);

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
        <Box 
          display='flex'
          alignItems='center'
          justifyContent='center'
          sx={{m: j%2 ? '2px 40px 2px 2px' : '2px', height: 25, width: 25, cursor: 'pointer'}}
          bgcolor={getRackLocationsColor(i,j+1)} 
          onClick={() => viewRack(i,j)}
        >
          <Typography fontSize={14} align='center'>{getRackLocations(i,j+1).length || ''}</Typography>
        </Box>
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
          <Box sx={{ p: 3, mb: 5, width: '20%', border: '1px solid', borderColor: 'secondary.light'}}>
            <Typography sx={{color: 'white', fontSize: 14}}>Zona de recepción y despacho</Typography>
          </Box>
          <Box pl={8}>
            <Box display='flex' item xs={8} mb={2} pl={5}>
              <Box border='1px solid' borderColor='secondary.light' width='250px' mr={5}>
                <Typography align='center' color='white'>Orgánico</Typography>
              </Box>
              <Box border='1px solid' borderColor='secondary.light' width='250px' mr={5}>
                <Typography align='center' color='white'>Inorgánico</Typography>
              </Box>
              <Box border='1px solid' borderColor='secondary.light' width='145px'>
                <Typography align='center' color='white'>Congelado</Typography>
              </Box>
            </Box>
            {map}
          </Box>
        </Grid>
        <Grid item xs={3} sx={{bgcolor: 'white', borderRadius: '5px'}}>
          <Box item xs={10} sx={{p: 2, bgcolor: 'primary.main', textAlign: 'center', borderRadius: '5px 5px 0px 0px'}}>
            <Typography sx={{fontWeight: '600', color: 'white'}}>Estado</Typography>
          </Box>
          <Box sx={{height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {locations ? <CustomCircularProgress value={locations.filter((location)=>location.handlingUnit).length*100/locations.length} thickness={3}/> : <CustomCircularProgress value={0} thickness={3}/>}
          </Box>
          <Divider variant='middle' sx={{bgcolor: 'secondary.light'}}/>
          <Box sx={{p: '20px 40px'}}>
          <Box display='flex' mb={2} sx={{justifyContent: 'space-between'}}>
              <Typography sx={{fontSize: 14, fontWeight: '500'}}>Unidades en inspección</Typography>
              <Typography sx={{fontSize: 14}}>{handlingUnits ? handlingUnits.filter((handlingUnit) => handlingUnit.status === 'En inspección').length : '-'}</Typography>
            </Box>
            <Box display='flex' mb={2} sx={{justifyContent: 'space-between'}}>
              <Typography sx={{fontSize: 14, fontWeight: '500'}}>Unidades a recepcionar</Typography>
              <Typography sx={{fontSize: 14}}>{handlingUnits ? handlingUnits.filter((handlingUnit) => handlingUnit.status === 'Registrado').length : '-'}</Typography>
            </Box>
            <Box display='flex' mb={2} sx={{justifyContent: 'space-between'}}>
              <Typography sx={{fontSize: 14, fontWeight: '500'}}>Unidades a despachar</Typography>
              <Typography sx={{fontSize: 14}}>{handlingUnits ? handlingUnits.filter((handlingUnit) => handlingUnit.status === 'Por despachar').length : '-'}</Typography>
            </Box>
            <Box display='flex' mb={2} sx={{justifyContent: 'space-between'}}>
              <Typography sx={{fontSize: 14, fontWeight: '500'}}>Ubicaciones libres</Typography>
              <Typography sx={{fontSize: 14}}>{locations ? locations.length - locations.filter((location)=>location.handlingUnit).length : '-'}</Typography>
            </Box>
            <Box display='flex' mb={2} sx={{justifyContent: 'space-between'}}>
              <Typography sx={{fontSize: 14, fontWeight: '500'}}>Ubicaciones ocupadas</Typography>
              <Typography sx={{fontSize: 14}}>{locations ? locations.filter((location)=>location.handlingUnit).length : '-'}</Typography>
            </Box>
            <Box display='flex' mb={2} sx={{justifyContent: 'space-between'}}>
              <Typography sx={{fontSize: 14, fontWeight: '700'}}>Ubicaciones en total</Typography>
              <Typography sx={{fontSize: 14}}>{locations ? locations.length : '-'}</Typography>
            </Box>
          </Box>
        </Grid>
        <Box display='flex' item xs={8} mt={5} pl={8}>
          <Box height={25} width={25} bgcolor='white'></Box>
          <Typography m={'0 20px'} color='white'>Disponible</Typography>
          <Box height={25} width={25} bgcolor='secondary.light'></Box>
          <Typography m={'0 20px'} color='white'>Parcialmente ocupado</Typography>
          <Box height={25} width={25} bgcolor='primary.main'></Box>
          <Typography m={'0 20px'} color='white'>Ocupado</Typography>
        </Box>
      </Grid>
    </Container>
  );
};

export default Almacen;