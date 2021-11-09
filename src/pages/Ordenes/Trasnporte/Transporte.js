import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { CustomDataGrid } from '../../../styles/CustomDataGrid';
import { CustomTextField } from '../../../styles/CustomTextField';
import { CustomSelect } from '../../../styles/CustomSelect';
import axios from "axios";
import moment from 'moment';


const Transporte = () => {
  const [transportOrders, setTransportOrders] = useState();

  const columns = [
    { field: "transportOrderId", headerName: "# Orden", flex: 1, headerAlign: 'center', align: 'center'},
    { field: "handlingUnit", headerName: "# UM", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value.handlingUnitId},
    { field: "product", headerName: "Producto", flex: 1.5, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnit.product.name},
    { field: "type", headerName: "Tipo", flex: 1.5, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.inboundOrder ? 'Ingreso' : 'Despacho'},
    { field: "date", headerName: "Fecha de registro", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'},
  ];
  
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/transportOrders").then((r) => {
      setTransportOrders(r.data);
    });
    const interval = setInterval(() => {
      axios.get(process.env.REACT_APP_API_URL + "/transportOrders").then((r) => {
        setTransportOrders(r.data);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  if (transportOrders) 
  return (
			<Container
				sx={{
					paddingTop: "40px",
				}}
				maxWidth="xl"
			>
				<Grid container alignItems="center">
					<Grid item xs={6}>
						<Typography variant="h4">Órdenes de transporte</Typography>
					</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField title="# Orden"/>
							<CustomTextField title="# UM"/>
              <CustomSelect title="Estado">
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'Pendiente'}>Pendiente</MenuItem>
                <MenuItem value={'Finalizado'}>Finalizado</MenuItem>
              </CustomSelect>
						</Grid>
					</Grid>
					<Grid item xs={4} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="flex-end">
							<Button
                sx={{mt: 3}}  
								variant="contained"
								color="primary"
								startIcon={<SearchIcon/>}
							>
								Buscar
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{pt: 5}}>
						<Box sx={{height: 640, flexGrow: 1}}>
							<CustomDataGrid hideFooterSelectedRowCount rows={transportOrders} columns={columns} pageSize={10}/>
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Transporte;