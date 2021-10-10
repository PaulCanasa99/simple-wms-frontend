import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router"
import FileUploadIcon from '@mui/icons-material/FileUpload';
import SearchIcon from '@mui/icons-material/Search';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import { CustomTextField } from '../../styles/CustomTextField';
import { CustomSelect } from '../../styles/CustomSelect';
import axios from "axios";
import moment from 'moment';

const columns = [
  { field: "code", headerName: "Ubicación", flex: 1.5, headerAlign: 'center', align: 'center'},
  { field: "handlingUnit", headerName: "# UM", flex: 1, headerAlign: 'center', align: 'center'},
  // { field: "HUQuantity", headerName: "Cantidad unidades", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnits.length},
  // { field: "products", headerName: "Cantidad unidades", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value.reduce((prev , curr) => prev + curr.quantity, 0)},
  // { field: "customer", headerName: "Cliente", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value.name},
  { field: "clasification", headerName: "Clasificación", flex: 1.5, headerAlign: 'center', align: 'center'},
  { field: "status", headerName: "Estado", flex: 1.5, headerAlign: 'center', align: 'center'},
];

const Estanteria = () => {
  
  const params = useParams();
  const [locations, setLocations] = useState();
  
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/locations/${params.rack}`).then((r) => {
      console.log(r.data)
      setLocations(r.data);
    });
  }, []);
  
  if (locations) 
  return (
			<Container
				sx={{
					paddingTop: "40px",
				}}
				maxWidth="xl"
			>
				<Grid container alignItems="center">
					<Grid item xs={6}>
						<Typography variant="h4">Almacén - Estanteria {params.rack}</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
              <Button
                component="span"
                variant="contained"
                color="primary"
                startIcon={<FileUploadIcon/>}
              >
                Volver a almacén
              </Button>
						</Grid>
					</Grid>
					<Grid item xs={8} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="space-between">
							<CustomTextField title="# Pedido"/>
							<CustomTextField title="Cliente"/>
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
							<CustomDataGrid rows={locations} columns={columns} pageSize={10}/>
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Estanteria;