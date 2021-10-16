import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
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

  const columns = [
    { field: "id", headerName: "# Orden", flex: 1.5, headerAlign: 'center', align: 'center'},
    { field: "HUQuantity", headerName: "Cantidad unidades", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnits.length},
    { field: "date", headerName: "Fecha de registro", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
    { field: "status", headerName: "Estado", flex: 1, headerAlign: 'center', align: 'center'},
    { field: 'actions', headerName: "Ver detalle", flex: 0.8, type: 'actions', getActions: (params) => [
      <GridActionsCellItem icon={<ArrowForwardIcon/>} onClick={() => navigate(`despacho/${params.id}`)} label="Ver detalle"/>,
      ]
    }
  ];
  
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/outboundOrders").then((r) => {
      setOutboundOrders(r.data);
    });
  }, []);
  
  if (outboundOrders) 
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
							<CustomDataGrid rows={outboundOrders} columns={columns} pageSize={10}/>
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Despacho;