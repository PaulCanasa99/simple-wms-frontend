import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useState, useEffect } from 'react';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import RestoreIcon from '@mui/icons-material/Restore';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import { CustomTextField } from '../../styles/CustomTextField';
import { CustomSelect } from '../../styles/CustomSelect';
import axios from 'axios';
import moment from 'moment';
import CustomSnackbar from '../../components/CustomSnackbar';
import { useNavigate } from "@reach/router"

const Inventario = () => {
  const navigate = useNavigate();
  const [unidadesManipulacion, setUnidadesManipulacion] = useState();
  const [alert, setAlert] = useState({isOpen: false, message: '', type: ''})
  const [filtered, setFiltered] = useState();
  const [statusSelected, setStatusSelected] = useState('Todos');
  const [productSearch, setProductSearch] = useState('');
  const [UMSearch, setUMSearch] = useState('');
  const [selectionModel, setSelectionModel] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/handlingUnits").then((r) => {
      setUnidadesManipulacion(r.data);
      setFiltered(r.data);
    });

    const interval = setInterval(() => {
      axios.get(`${process.env.REACT_APP_API_URL}/handlingUnits`).then((r) => {
        setUnidadesManipulacion(r.data);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    if(!unidadesManipulacion) return;
    search();
    //  eslint-disable-next-line
  }, [statusSelected, productSearch, UMSearch, unidadesManipulacion]);
  
  const columns = [
    { field: "handlingUnitId", headerName: "# UM", flex: 1, headerAlign: 'center', align: 'center'},
    { field: "productCode", headerName: "Producto", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.code},
    { field: "productClasification", headerName: "Clasificaci??n", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.clasification},
    { field: "location", headerName: "Ubicaci??n", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.location ? 
      <Typography sx={{cursor: 'pointer'}} fontWeight={600} onClick={() => navigate(`almacen/${data.row.location.code.substring(0,2)}`) }>{data.row.location.code}</Typography>  : '-',
      sortComparator: (v1, v2) => v1 && v2 && v1.code < v2.code ? -1 : 1
    },
    { field: "entryDate", headerName: "Fecha de ingreso", flex: 2, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "expirationDate", headerName: "Fecha de expiraci??n", flex: 2, headerAlign: 'center', align: 'center',  valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "status", headerName: "Estado", flex: 1.5, headerAlign: 'center', align: 'center'},
  ];

  const search = () => {
    let query = unidadesManipulacion;
    query = query.filter((unidadManipulacion) => statusSelected === 'Todos' || unidadManipulacion.status === statusSelected);
    query = query.filter((unidadManipulacion) => unidadManipulacion.product.code.includes(productSearch));
    query = query.filter((unidadManipulacion) => unidadManipulacion.handlingUnitId.toString().includes(UMSearch));
    setFiltered(query);
  }

  const clear = () => {
    setProductSearch('');
    setUMSearch('');
    setStatusSelected('Todos');
  }

  const asignacionGRASP = async () => {
    if (selectionModel.length) {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/handlingUnits/graspAssignationTransport`, {data: selectionModel}).then((r) => {
        const length = r.data.length;
        setAlert({isOpen: true, message: `Se asign${length > 1 ? 'aron' : '??'} ${length} unidad${length > 1 ? 'es' : ''} de manera exitosa.`, type: 'success'})
      })
      axios.get(process.env.REACT_APP_API_URL + "/handlingUnits").then((r) => {
        setUnidadesManipulacion(r.data);
        setFiltered(r.data);
        clear();
        setLoading(false);
      });
    }
    else 
      setAlert({isOpen: true, message: 'Debe seleccionar una unidad por lo menos', type: 'warning'})
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
						<Typography variant="h4">Inventario</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
							<LoadingButton
                loading={loading}
                onClick={asignacionGRASP}
								variant="contained"
								color="primary"
								startIcon={<CallReceivedIcon/>}
                loadingPosition="start"
							>
								Asignar ubicaciones
							</LoadingButton>
						</Grid>
        	</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField value={UMSearch} title="# UM" onChange={(e) => setUMSearch(e.target.value)}/>
							<CustomTextField value={productSearch} title="Producto" onChange={(e) => setProductSearch(e.target.value)}/>
              <CustomSelect value={statusSelected} onChange={(e) => setStatusSelected(e.target.value)} title="Estado">
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'En inspecci??n'}>En inspecci??n</MenuItem>
                <MenuItem value={'Registrado'}>Registrado</MenuItem>
                <MenuItem value={'Por ingresar'}>Por ingresar</MenuItem>
                <MenuItem value={'Libre disponibilidad'}>Libre disponibilidad</MenuItem>
                <MenuItem value={'Reservado'}>Reservado</MenuItem>
                <MenuItem value={'Por despachar'}>Por despachar</MenuItem>
                <MenuItem value={'Despachado'}>Despachado</MenuItem>
                <MenuItem value={'Observado'}>Observado</MenuItem>
              </CustomSelect>
						</Grid>
					</Grid>
					<Grid item xs={4} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="flex-end">
							<Button
                sx={{mt: 3}}
                onClick={clear}
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
							<CustomDataGrid
                checkboxSelection
                onSelectionModelChange={(newSelectionModel) => {
                  setSelectionModel(newSelectionModel);
                }}
                selectionModel={selectionModel}
                isRowSelectable={(params) => params.row.status === 'Registrado'}
                rows={filtered} 
                columns={columns}
                pageSize={10}
                disableColumnMenu={true}/>
						</Box>
					</Grid>
				</Grid>
        <CustomSnackbar alert={alert} setAlert={setAlert}/>
      </Container>
    );
  return null;
  };

  export default Inventario;