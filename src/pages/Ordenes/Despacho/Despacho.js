import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import RestoreIcon from '@mui/icons-material/Restore';
import { CustomDataGrid } from '../../../styles/CustomDataGrid';
import { CustomTextField } from '../../../styles/CustomTextField';
import { CustomSelect } from '../../../styles/CustomSelect';
import axios from "axios";
import moment from 'moment';
import { GridActionsCellItem } from '@mui/x-data-grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "@reach/router"


const Despacho = () => {
  const navigate = useNavigate();
  const [outboundOrders, setOutboundOrders] = useState();
  const [filtered, setFiltered] = useState();
  const [outboundOrderSearch, setOutboundOrderSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [statusSelected, setStatusSelected] = useState('Todos');

  const columns = [
    { field: "outboundOrderId", headerName: "# Orden", flex: 1, headerAlign: 'center', align: 'center'},
    { field: "order", headerName: "# Pedido", flex: 1, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value.orderId},
    { field: "HUQuantity", headerName: "Cantidad unidades", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnits.length},
    { field: "date", headerName: "Fecha de registro", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'},
    { field: 'actions', headerName: "Ver detalle", flex: 0.8, type: 'actions', getActions: (params) => [
      <GridActionsCellItem icon={<ArrowForwardIcon/>} onClick={() => navigate(`despacho/${params.id}`)} label="Ver detalle"/>,
      ]
    }
  ];
  
  useEffect(() => {
    if(!outboundOrders) return;
    search();
    //  eslint-disable-next-line
  }, [outboundOrderSearch, orderSearch, statusSelected, outboundOrders]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/outboundOrders").then((r) => {
      setOutboundOrders(r.data);
      setFiltered(r.data);
    });
    const interval = setInterval(() => {
      axios.get(process.env.REACT_APP_API_URL + "/outboundOrders").then((r) => {
        setOutboundOrders(r.data);
      });
    }, 5000);
    return () => clearInterval(interval);  
  }, []);
  
  const search = () => {
    let query = outboundOrders;
    query = query.filter((outboundOrder) => statusSelected === 'Todos' || outboundOrder.status === statusSelected);
    query = query.filter((outboundOrder) => outboundOrder.outboundOrderId.toString().includes(outboundOrderSearch));
    query = query.filter((outboundOrder) => outboundOrder.order.orderId.toString().includes(orderSearch));
    setFiltered(query);
  }

  const clear = () => {
    setOutboundOrderSearch('');
    setOrderSearch('');
    setStatusSelected('Todos');
  }

  if (filtered) 
  return (
			<Container
				sx={{
					paddingTop: "40px",
				}}
				maxWidth="xl"
			>
				<Grid container alignItems="center">
					<Grid item xs={6}>
						<Typography variant="h4">Órdenes de despacho</Typography>
					</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
              <CustomTextField value={outboundOrderSearch} onChange={(e) => setOutboundOrderSearch(e.target.value)} title="# Orden"/>
							<CustomTextField value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} title="# Pedido"/>
              <CustomSelect onChange={(e) => setStatusSelected(e.target.value)} title="Estado">
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'Pendiente'}>Pendiente</MenuItem>
                <MenuItem value={'En proceso'}>En proceso</MenuItem>
                <MenuItem value={'Finalizado'}>Finalizado</MenuItem>
              </CustomSelect>
						</Grid>
					</Grid>
					<Grid item xs={4} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="flex-end">
            <Button
                onClick={clear}
                sx={{mt: 3}}  
								variant="contained"
								color="primary"
								startIcon={<RestoreIcon/>}
							>
								Limpiar filtros
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{pt: 5}}>
						<Box sx={{height: 640, flexGrow: 1}}>
							<CustomDataGrid hideFooterSelectedRowCount disableColumnMenu rows={filtered} columns={columns} pageSize={10}/>
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Despacho;