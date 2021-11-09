import { Button, Container, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import { useParams } from "@reach/router"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import axios from "axios";
import { useNavigate } from "@reach/router"

const columns = [
  { field: "code", headerName: "Ubicación", flex: 1, headerAlign: 'center', align: 'center'},
  { field: "handlingUnitCode", headerName: "# UM", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnit ? data.row.handlingUnit.handlingUnitId : '-'},
  { field: "productCode", headerName: "Codigo producto", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnit ? data.row.handlingUnit.product.code : '-'},
  { field: "handlingUnit", headerName: "Nombre producto", flex: 1.5, headerAlign: 'center', align: 'center', valueFormatter: (data) => data.value ? data.value.product.name : '-' },
  { field: "productRotation", headerName: "Rotación ABC", flex: 1, headerAlign: 'center', align: 'center', renderCell: (data) => data.row.handlingUnit ? data.row.handlingUnit.product.rotation : '-'},
  { field: "clasification", headerName: "Clasificación", flex: 1.5, headerAlign: 'center', align: 'center'},
  { field: "status", headerName: "Estado", flex: 1.5, headerAlign: 'center', align: 'center'},
];
const Estanteria = () => {
  
  const params = useParams();
  const [locations, setLocations] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/locations/${params.rack}`).then((r) => {
      setLocations(r.data);
    });
  }, [params.rack]);
  
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
						<Typography variant="h4">Almacén - Estantería {params.rack}</Typography>
					</Grid>
					<Grid item xs={6}>
						<Grid container justifyContent="flex-end">
              <Button
                onClick={() => navigate(-1)}
                component="span"
                variant="contained"
                color="primary"
                startIcon={<ArrowBackIcon/>}
              >
                Volver a almacén
              </Button>
						</Grid>
					</Grid>
					<Grid item xs={12} sx={{pt: 5}}>
						<Box sx={{height: 640, flexGrow: 1}}>
							<CustomDataGrid hideFooterSelectedRowCount hideFooterPagination rows={locations} columns={columns} pageSize={10} disableColumnMenu/>
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Estanteria;