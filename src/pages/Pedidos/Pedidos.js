import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { parse } from 'papaparse';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestoreIcon from '@mui/icons-material/Restore';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import { CustomTextField } from '../../styles/CustomTextField';
import { CustomSelect } from '../../styles/CustomSelect';
import axios from "axios";
import moment from 'moment';
import { GridActionsCellItem } from '@mui/x-data-grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "@reach/router"
import CustomSnackbar from '../../components/CustomSnackbar';

const Input = styled('input')({
  display: 'none',
});

const Pedidos = () => {
  
  const [orders, setOrders] = useState();
  const navigate = useNavigate();
  const [filtered, setFiltered] = useState();
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [statusSelected, setStatusSelected] = useState('Todos');
  const [alert, setAlert] = useState({isOpen: false, message: '', type: ''})

  const columns = [
    { field: "id", headerName: "# Pedido", flex: 1.5, headerAlign: 'center', align: 'center'},
    { field: "products", headerName: "Cantidad unidades", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value.reduce((prev , curr) => prev + curr.quantity, 0)},
    { field: "customer", headerName: "Cliente", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value.name},
    { field: "date", headerName: "Fecha de registro", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'},
    { field: 'actions', headerName: "Ver detalle", flex: 1, type: 'actions', getActions: (params) => [
        <GridActionsCellItem icon={<ArrowForwardIcon/>} onClick={() => navigate(`pedidos/${params.id}`)} label="Ver detalle"/>,
      ]
    }
  ];

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/orders").then((r) => {
      setOrders(r.data);
      setFiltered(r.data);
    });
  }, []);

  useEffect(() => {
    if(!orders) return;
    search();
    //  eslint-disable-next-line
  }, [statusSelected, orderSearch, customerSearch]);

  const search = () => {
    let query = orders;
    query = query.filter((order) => statusSelected === 'Todos' || order.status === statusSelected);
    query = query.filter((order) => order.id.includes(orderSearch));
    query = query.filter((order) => order.customer.name.includes(customerSearch));
    setFiltered(query);
  }
  
  const clear = () => {
    setOrderSearch('');
    setCustomerSearch('');
    setStatusSelected('Todos');
  }

  const uploadFile = async (file) => {
    const text = await file.text();
    const result = parse(text, {header: true});
    await axios.post(process.env.REACT_APP_API_URL + "/orders/import", result).then((r) => {
      setAlert({isOpen: true, message: 'Pedidos cargados de manera exitosa.', type: 'success'})
    });
    axios.get(process.env.REACT_APP_API_URL + "/orders").then((r) => {
      setOrders(r.data);
      setFiltered(r.data);
    });
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
						<Typography variant="h4">Pedidos</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
              <label htmlFor="contained-button-file">
                <Input accept="text/csv, .csv" id="contained-button-file" multiple type="file" onChange={(e) => uploadFile(e.target.files[0])}/>
                <Button
                  component="span"
                  variant="contained"
                  color="primary"
                  startIcon={<FileUploadIcon/>}
                >
                  Cargar pedidos
                </Button>
              </label>
						</Grid>
					</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} title="# Pedido"/>
							<CustomTextField value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} title="Cliente"/>
              <CustomSelect value={statusSelected} onChange={(e) => setStatusSelected(e.target.value)} title="Estado">
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'Pendiente'}>Pendiente</MenuItem>
                <MenuItem value={'En proceso'}>En proceso</MenuItem>
                <MenuItem value={'Despachado'}>Despachado</MenuItem>
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
							<CustomDataGrid hideFooterSelectedRowCount rows={filtered} columns={columns} pageSize={10}/>
						</Box>
					</Grid>
				</Grid>
        <CustomSnackbar alert={alert} setAlert={setAlert}/>
      </Container>
    );

  return null;
  };

  export default Pedidos;