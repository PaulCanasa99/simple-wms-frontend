import { Button, Container, Grid, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RestoreIcon from '@mui/icons-material/Restore';
import SummarizeIcon from '@mui/icons-material/Summarize';
import EditIcon from '@mui/icons-material/Edit';
import { CustomDataGrid } from '../../styles/CustomDataGrid';
import { CustomTextField } from '../../styles/CustomTextField';
import { CustomSelect } from '../../styles/CustomSelect';
import axios from "axios";
import { GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from "@reach/router"

const Productos = () => {
  const [productos, setProductos] = useState();
  const [filtered, setFiltered] = useState();
  const navigate = useNavigate();
  const [codeSearch, setCodeSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const [rotationSelected, setRotationSelected] = useState('Todos');
  const [clasificationSelected, setClasificationSelected] = useState('Todos');

  const columns = [
    { field: "code", headerName: "Código", flex: 1, headerAlign: 'center', align: 'center'},
    { field: "name", headerName: "Nombre", flex: 1.5, headerAlign: 'center', align: 'center'},
    { field: "productsPerHU", headerName: "Productos por unidad", flex: 1, headerAlign: 'center', align: 'center'},
    { field: "rotation", headerName: "Rotación ABC", flex: 1, headerAlign: 'center', align: 'center'},
    { field: "clasification", headerName: "Clasificación", flex: 1, headerAlign: 'center', align: 'center'},
    { field: 'actions', headerName: "Ver detalle", flex: 1, type: 'actions', getActions: (params) => [
      <GridActionsCellItem icon={<SummarizeIcon/>} onClick={() => navigate(`productos/${params.id}`)} label="Ver kardex"/>,
      <GridActionsCellItem icon={<EditIcon/>} onClick={() => navigate(`pedidos/${params.id}`)} label="Editar"/>,
    ]}
  ];

  useEffect(() => {
    if(!productos) return;
    search();
    //  eslint-disable-next-line
  }, [codeSearch, nameSearch, rotationSelected, clasificationSelected]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/products").then((r) => {
      setProductos(r.data);
      setFiltered(r.data);
    });
  }, []);
  
  const search = () => {
    let query = productos;
    query = query.filter((producto) => rotationSelected === 'Todos' || producto.rotation === rotationSelected);
    query = query.filter((producto) => clasificationSelected === 'Todos' || producto.clasification === clasificationSelected);
    query = query.filter((producto) => producto.code.includes(codeSearch));
    query = query.filter((producto) => producto.name.includes(nameSearch));
    setFiltered(query);
  }

  const clear = () => {
    setCodeSearch('');
    setNameSearch('');
    setRotationSelected('Todos');
    setClasificationSelected('Todos');
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
							<CustomTextField value={codeSearch} onChange={(e) => setCodeSearch(e.target.value)} title="Código"/>
							<CustomTextField value={nameSearch} onChange={(e) => setNameSearch(e.target.value)} title="Nombre"/>
              <CustomSelect value={rotationSelected} onChange={(e) => setRotationSelected(e.target.value)} title="Rotación">
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'A'}>A</MenuItem>
                <MenuItem value={'B'}>B</MenuItem>
                <MenuItem value={'C'}>C</MenuItem>
              </CustomSelect>
              <CustomSelect value={clasificationSelected} onChange={(e) => setClasificationSelected(e.target.value)} title="Clasificación">
                <MenuItem value={'Todos'}>Todos</MenuItem>
                <MenuItem value={'Orgánico'}>Orgánico</MenuItem>
                <MenuItem value={'Inorgánico'}>Inorgánico</MenuItem>
                <MenuItem value={'Congelado'}>Congelado</MenuItem>
              </CustomSelect>
						</Grid>
					</Grid>
					<Grid item xs={2} sx={{pt: 5, display: 'flex'}}>
						<Grid container justifyContent="flex-end">
							<Button
                onClick={clear}
                sx={{mt: 3}}  
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
							<CustomDataGrid disableColumnMenu rows={filtered} columns={columns} pageSize={10} />
						</Box>
					</Grid>
				</Grid>
      </Container>
    );

  return null;
  };

  export default Productos;