import { Button, Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import { CustomDataGrid } from '../../../styles/CustomDataGrid';
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import DetailHeader from '../../../components/DetailHeader';
import { useParams } from "@reach/router"
import moment from 'moment';
import { useNavigate } from "@reach/router"
import CustomSnackbar from '../../../components/CustomSnackbar';

const columns = [
  { field: "posNumber", headerName: "Posición", flex: 0.5, headerAlign: 'center', align: 'center'},
  { field: "handlingUnitId", headerName: "# UM", flex: 0.5, headerAlign: 'center', align: 'center'},
  { field: "productCode", headerName: "Código", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.code},
  { field: "productName", headerName: "Nombre", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.name},
  { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'}
];

const DetalleDespacho = () => {
  
  const [alert, setAlert] = useState({isOpen: false, message: '', type: ''})
  const [order, setOrder] = useState();
  const [selectionModel, setSelectionModel] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/outboundOrders/${params.idOrden}`).then((r) => {
      const inboundOrder = r.data;
      inboundOrder.handlingUnits = inboundOrder.handlingUnits.map((handlingUnit, index) => 
        ({...handlingUnit, posNumber: index + 1}));
      setOrder(inboundOrder);
    });
    const interval = setInterval(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/outboundOrders/${params.idOrden}`).then((r) => {
        const inboundOrder = r.data;
        inboundOrder.handlingUnits = inboundOrder.handlingUnits.map((handlingUnit, index) => 
          ({...handlingUnit, posNumber: index + 1}));
        setOrder(inboundOrder);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [params.idOrden]);

  const despacho = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/outboundOrders/generateTransportOrders/${params.idOrden}`, {data: selectionModel}).then((r) => {
      setAlert({isOpen: true, message: `Selección de unidades a despachar exitosa`, type: 'success'})
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
						<Typography variant="h4">Órden de despacho</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
              <Button
                onClick={despacho}
                sx={{mr: 3}}
								variant="contained"
								color="primary"
								startIcon={<FactCheckIcon/>}
							>
								Despachar unidades
							</Button>
              <Button
                onClick={() => navigate(-1)}
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon/>}
              >
                Ver órdenes de despacho
              </Button>
						</Grid>
					</Grid>
          <Grid item xs={12} mt={3}>
            <Grid container p={3} sx={{boxShadow: 3, borderRadius: 1}} bgcolor='white'>
              <Grid item xs={6} p={'0px 100px'}>
                <DetailHeader label='# Orden:' value={order.outboundOrderId}/>
                <DetailHeader label='Fecha de registro:' value={moment(order.date).format('D [de] MMMM YYYY')}/>
                <DetailHeader label='Estado:' value={order.status}/>
              </Grid>
            </Grid>
					</Grid>
					<Grid item xs={12} sx={{pt: 5}}>
						<Box sx={{height: 640, flexGrow: 1}}>
							<CustomDataGrid 
                disableColumnMenu
                rows={order.handlingUnits}
                columns={columns}
                pageSize={10}
                checkboxSelection
                isRowSelectable={(params) => params.row.status === 'Reservado'}
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

  export default DetalleDespacho;