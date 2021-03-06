import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import axios from "axios";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DetailHeader from '../../components/DetailHeader';
import { useParams } from "@reach/router"
import DatePicker from '@mui/lab/DatePicker';
import moment from 'moment';
import { useNavigate } from "@reach/router"

const columns = [
  { field: "id", headerName: "# Orden", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "type", headerName: "Tipo de movimiento", flex: 1, headerAlign: 'center', align: 'center'},
  // { field: "productName", headerName: "Código", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.name},
  { field: "date", headerName: "Fecha", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
  { field: "quantityUM", headerName: "Cantidad UM", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnits.length},
  // { field: "stock", headerName: "Stock disponible UM", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.name},
];
const groupByArray = (xs, key, type) => { 
  return xs.reduce(function (rv, x) { 
    let v = key instanceof Function ? key(x) : x[key]['id'];
    console.log(x); 
    let el = rv.find((r) => r && r.key === v);
    if (el) el.handlingUnits.push(x);
    else rv.push({ key: v, handlingUnits: [x], date: type === 'Ingreso' ? x.inboundOrder.date : x.outboundOrder.date, id: type === 'Ingreso' ? x.inboundOrder.inboundOrderId : x.outboundOrder.outboundOrderId, type: type });
    return rv; 
  }, []); 
}

// const groupByArray = (xs, key) => {
//   return xs.reduce(function (rv, x) { 
//     let v = key instanceof Function ? key(x) : x[key]; let el = rv.find((r) => r && r.key === v);
//     if (el) { el.values.push(x); } 
//     else {
//       rv.push({ ...v, handlingUnits: [x]});
//     }
//     return rv;
//   }, [])
// }

const Kardex = () => {
  
  const [product, setProduct] = useState();
  const [orders, setOrders] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState();
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    setStartDate(date);
    setEndDate(new Date());
  }, []);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/products/${params.idProducto}`).then((r) => {
      setProduct(r.data);
    });
  }, [params.idProducto]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/handlingUnits/${params.idProducto}`).then((r) => {
      const inboundOrders = groupByArray(r.data, 'inboundOrder', 'Ingreso');
      let outboundOrders = r.data.filter((handlingUnit) => handlingUnit.outboundOrder);
      outboundOrders = groupByArray(outboundOrders, 'outboundOrder', 'Despacho');
      let ordersAux = inboundOrders.concat(outboundOrders);
      ordersAux = ordersAux.filter((order) => new Date(order.date) >= startDate && new Date(order.date) <= endDate);
      ordersAux.sort((a, b) => a.id - b.id);
      setOrders(ordersAux);
    });
  }, [params.idProducto, startDate, endDate]);

  if (orders) 
  return (
			<Container
				sx={{
					paddingTop: "40px",
				}}
				maxWidth="xl"
			>
				<Grid container alignItems="center">
					<Grid item xs={6}>
						<Typography variant="h4">Reporte Kardex</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
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
                <DetailHeader label='Código:' value={product.code}/>
                <DetailHeader label='Nombre:' value={product.name}/>
                <DetailHeader label='Rotación ABC:' value={product.rotation}/>
                <DetailHeader label='Clasificación:' value={product.clasification}/>
              </Grid>
              <Grid item xs={6} p={'0px 100px'}>
                <DetailHeader label='Fecha de inicio:'>
                  <DatePicker
                    label="Fecha de inicio"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DetailHeader>
                <DetailHeader label='Fecha de fin:'>
                  <DatePicker
                    label="Fecha de fin"
                    value={endDate}
                    onChange={(newValue) => {
                      setEndDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </DetailHeader>
              </Grid>
            </Grid>
					</Grid>
					<Grid item xs={12} sx={{pt: 5}}>
						<Box sx={{height: 640, flexGrow: 1}}>
							<CustomDataGrid 
                disableColumnMenu
                rows={orders}
                columns={columns}
                pageSize={10}
                getRowClassName={(params) => 
                  params.row.type === 'Ingreso' ? 'inboundOrder' : 'outboundOrder'
                }
                />
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Kardex;