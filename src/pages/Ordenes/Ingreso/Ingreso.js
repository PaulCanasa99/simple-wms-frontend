import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { parse } from 'papaparse';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import { CustomDataGrid } from '../../../styles/CustomDataGrid';
import { CustomTextField } from '../../../styles/CustomTextField';
import { CustomSelect } from '../../../styles/CustomSelect';
import CustomSnackbar from '../../../components/CustomSnackbar';
import axios from "axios";
import moment from 'moment';
import { GridActionsCellItem } from '@mui/x-data-grid';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from "@reach/router"

const Input = styled('input')({
  display: 'none',
});
  
const Ingreso = () => {
  const navigate = useNavigate();
  const [inboundOrders, setInboundOrders] = useState();
  const [alert, setAlert] = useState({isOpen: false, message: '', type: ''})

  const columns = [
    { field: "id", headerName: "# Orden", flex: 1.5, headerAlign: 'center', align: 'center'},
    { field: "warehouseWorker", headerName: "Encargado", flex: 1, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value ?? '-'},
    { field: "HUQuantity", headerName: "Cantidad unidades", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnits.length},
    { field: "date", headerName: "Fecha de registro", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'},
    { field: 'actions', headerName: "Ver detalle", flex: 0.8, type: 'actions', getActions: (params) => [
      <GridActionsCellItem icon={<ArrowForwardIcon/>} onClick={() => navigate(`ingreso/${params.id}`)} label="Ver detalle"/>,
      ]
    }
  ];

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/inboundOrders").then((r) => {
      setInboundOrders(r.data);
    });
  }, []);

  const uploadFile = async (file) => {
    const text = await file.text();
    const result = parse(text, {header: true});
    axios.post(process.env.REACT_APP_API_URL + "/inboundOrders/import", result).then((r) => {
      setAlert({isOpen: true, message: 'Órdenes cargadas de manera exitosa.', type: 'success'})
      axios.get(process.env.REACT_APP_API_URL + "/inboundOrders").then((r) => {
        setInboundOrders(r.data);
      });
    });   
  }

  if (inboundOrders) 
  return (
			<Container
				sx={{
					paddingTop: "40px",
				}}
				maxWidth="xl"
			>
				<Grid container alignItems="center">
					<Grid item xs={6}>
						<Typography variant="h4">Órdenes de ingreso</Typography>
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
                  Cargar órdenes de ingreso
                </Button>
              </label>
						</Grid>
					</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField title="# Orden"/>
							<CustomTextField title="Encargado"/>
              <CustomSelect title="Estado">
                <MenuItem value={'organico'}>Orgánico</MenuItem>
                <MenuItem value={'inorganico'}>Inorgánico</MenuItem>
                <MenuItem value={'congelado'}>Congelado</MenuItem>
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
							<CustomDataGrid hideFooterSelectedRowCount rows={inboundOrders} columns={columns} pageSize={10}/>
						</Box>
					</Grid>
				</Grid>
        <CustomSnackbar alert={alert} setAlert={setAlert}/>
      </Container>
    );

  return null;
  };

  export default Ingreso;