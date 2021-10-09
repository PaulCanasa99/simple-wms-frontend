import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import { CustomTextField } from '../../styles/CustomTextField';
import { CustomSelect } from '../../styles/CustomSelect';
import axios from "axios";

const columns = [
  { field: "code", headerName: "Código", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "name", headerName: "Nombre", flex: 1.5},
  { field: "productsPerHU", headerName: "Productos por unidad", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "rotation", headerName: "Rotación ABC", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "clasification", headerName: "Clasificación", flex: 1, headerAlign: 'center', align: 'center'},
];
  
const Productos = () => {
  const [productos, setProductos] = useState();
  
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/products").then((r) => {
      setProductos(r.data);
    });
  }, []);
  
  if (productos) 
  return (
			<Container
				sx={{
					paddingTop: "40px",
				}}
				maxWidth="xl"
			>
				<Grid container alignItems="center">
					<Grid item xs={6}>
						<Typography variant="h4">Productos</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
							<Button
								variant="contained"
								color="primary"
								startIcon={<FileUploadIcon/>}
							>
								Cargar productos
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={10} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField title="Código"/>
							<CustomTextField title="Nombre"/>
              <CustomSelect title="Rotación">
                <MenuItem value={'A'}>A</MenuItem>
                <MenuItem value={'B'}>B</MenuItem>
                <MenuItem value={'C'}>C</MenuItem>
              </CustomSelect>
              <CustomSelect title="Clasificación">
                <MenuItem value={'organico'}>Orgánico</MenuItem>
                <MenuItem value={'inorganico'}>Inorgánico</MenuItem>
                <MenuItem value={'congelado'}>Congelado</MenuItem>
              </CustomSelect>
						</Grid>
					</Grid>
					<Grid item xs={2} sx={{pt: 5, display: 'flex'}}>
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
							<CustomDataGrid disableSelectionOnClick rows={productos} columns={columns} pageSize={10} />
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Productos;