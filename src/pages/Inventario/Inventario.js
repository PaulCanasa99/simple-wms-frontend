import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState, useEffect } from 'react';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import SearchIcon from '@mui/icons-material/Search';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import { CustomTextField } from '../../styles/CustomTextField';
import { CustomSelect } from '../../styles/CustomSelect';
import axios from 'axios';
import moment from 'moment';

const columns = [
	{ type: 'number',	field: "id", headerName: "# UM", flex: 2, headerAlign: 'center', align: 'center'},
  { field: "productCode", headerName: "Producto", flex: 1.5, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.code},
  { field: "productsPerHU", headerName: "Cantidad", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.product.productsPerHU},
  { field: "ubicacion", headerName: "Ubicación", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "entryDate", headerName: "Fecha de ingreso", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
  { field: "expirationDate", headerName: "Fecha de expiración", flex: 1.5, headerAlign: 'center', align: 'center',  valueFormatter: (data) => moment(data.value).format('D [de] MMMM YYYY')},
  { field: "status", headerName: "Estado", flex: 2, headerAlign: 'center', align: 'center'},
];
  
const Inventario = () => {
  const [unidadesManipulacion, setUnidadesManipulacion] = useState();

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/handlingUnits").then((r) => {
      setUnidadesManipulacion(r.data);
    });
  }, []);

  if (unidadesManipulacion)
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
							<Button
								variant="contained"
								color="primary"
								startIcon={<CallReceivedIcon/>}
							>
								Asignar ubicaciones
							</Button>
						</Grid>
        	</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField title="# UM"/>
							<CustomTextField title="Producto"/>
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
							<CustomDataGrid rows={unidadesManipulacion} columns={columns} pageSize={10} disableColumnMenu={true}/>
						</Box>
					</Grid>
				</Grid>
      </Container>
    );
  return null;
  };

  export default Inventario;