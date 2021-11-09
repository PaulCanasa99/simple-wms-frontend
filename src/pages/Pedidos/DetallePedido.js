import { Button, Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DetailHeader from '../../components/DetailHeader';
import { useParams } from "@reach/router"
import moment from 'moment';
import { useNavigate } from "@reach/router"
import CustomSnackbar from '../../components/CustomSnackbar';
import { LoadingButton } from '@mui/lab';

const columns = [
  { field: "posNumber", headerName: "Posición", flex: 0.5, headerAlign: 'center', align: 'center'},
  { field: "productCode", headerName: "Código", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.code},
  { field: "productName", headerName: "Nombre", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.name},
  { field: "quantity", headerName: "Cantidad UM", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "stock", headerName: "Stock disponible UM", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'}
];

const DetallePedido = () => {
  
  const [alert, setAlert] = useState({isOpen: false, message: '', type: ''})
  const [order, setOrder] = useState();
  const [selectionModel, setSelectionModel] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/orders/${params.idPedido}`).then((r) => {
      const order = r.data;
      console.log(r.data);
      order.products = order.products.map((product, index) => 
        ({...product, id: product._id, posNumber: index + 1}));
      setOrder(order);
    });
  }, [params.idPedido]);

  const despacho = async () => {
    setLoading(true);
    await axios.post(`${process.env.REACT_APP_API_URL}/orders/outboundSelection/${params.idPedido}`, {data: selectionModel}).then((r) => {
      setAlert({isOpen: true, message: `Selección de unidades a despachar exitosa`, type: 'success'})
    });
    axios.get(`${process.env.REACT_APP_API_URL}/orders/${params.idPedido}`).then((r) => {
      const order = r.data;
      order.products = order.products.map((product, index) => 
        ({...product, id: product._id, posNumber: index + 1}));
      setOrder(order);
      setLoading(false);
    });
  }

  if (order) 
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
             <LoadingButton
                loading={loading}
                onClick={despacho}
                sx={{mr: 3}}
								variant="contained"
								color="primary"
								startIcon={<FactCheckIcon/>}
                loadingPosition="start"
							>
								Despachar unidades
							</LoadingButton>
              <Button
                onClick={() => navigate(-1)}
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon/>}
              >
                Ver pedidos
              </Button>
						</Grid>
					</Grid>
          <Grid item xs={12} mt={3}>
            <Grid container p={3} sx={{boxShadow: 3, borderRadius: 1}} bgcolor='white'>
              <Grid item xs={6} p={'0px 100px'}>
                <DetailHeader label='# Pedido:' value={order.orderId}/>
                <DetailHeader label='Cliente:' value={order.customer.name}/>
                <DetailHeader label='Fecha de registro:' value={moment(order.date).format('D [de] MMMM YYYY')}/>
                <DetailHeader label='Estado:' value={order.status}/>
              </Grid>
              <Grid item xs={6} p={'0px 100px'}>
                <DetailHeader label='Nombre del contacto:' value={order.customer.contactName}/>
                <DetailHeader label='Teléfono del contacto:' value={order.customer.contactPhoneNumber}/>
                <DetailHeader label='Dirección:' value={order.customer.address}/>
              </Grid>
            </Grid>
					</Grid>
					<Grid item xs={12} sx={{pt: 5}}>
						<Box sx={{height: 640, flexGrow: 1}}>
							<CustomDataGrid 
                disableColumnMenu
                checkboxSelection
                rows={order.products}
                columns={columns}
                pageSize={10}
                isRowSelectable={(params) => params.row.quantity <= params.row.stock && params.row.status === 'Pendiente'}
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                />
						</Box>
					</Grid>
				</Grid>
        <CustomSnackbar alert={alert} setAlert={setAlert}/>
      </Container>
    );

  return null;
  };

  export default DetallePedido;