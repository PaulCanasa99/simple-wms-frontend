import React, { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import axios from 'axios';

const ProductoResumen = (props) => {

  const { productoSelected, setOpen } = props;
  const [unidadesManipulacion, setUnidadesManipulacion] = useState();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/handlingUnits`).then((r) => {
      setUnidadesManipulacion(r.data.filter((u) => u.product.id === productoSelected.id));
    });
  }, [productoSelected])

  const handleClose = () => {
    setOpen(false);
  };

  if (unidadesManipulacion && productoSelected) 
  return (
    <Dialog onClose={handleClose} open={props.open}>
      <DialogTitle>Resumen - {productoSelected.row?.code}</DialogTitle>
      <List sx={{ pt: 0, pl: 2, width: 350 }}>
        <ListItem >
          <ListItemText primary="En inspección" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'En inspección').length} sx={{width: '20%'}}/>
        </ListItem>
        <ListItem >
          <ListItemText primary="Registrado" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'Registrado').length} sx={{width: '20%'}}/>
        </ListItem>
        <ListItem >
          <ListItemText primary="Por ingresar" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'Por ingresar').length} sx={{width: '20%'}}/>
        </ListItem>
        <ListItem >
          <ListItemText primary="Libre disponibilidad" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'Libre disponibilidad').length} sx={{width: '20%'}}/>
        </ListItem>
        <ListItem >
          <ListItemText primary="Reservado" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'Reservado').length} sx={{width: '20%'}}/>
        </ListItem>
        <ListItem >
          <ListItemText primary="Por despachar" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'Por despachar').length} sx={{width: '20%'}}/>
        </ListItem>
        <ListItem >
          <ListItemText primary="Despachado" sx={{width: '80%'}}/>
          <ListItemText primary={unidadesManipulacion.filter((u) => u.status === 'Despachado').length} sx={{width: '20%'}}/>
        </ListItem>
      </List>
    </Dialog>
  );

  else return null;
}

export default ProductoResumen;