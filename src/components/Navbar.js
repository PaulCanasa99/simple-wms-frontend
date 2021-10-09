import React, { useState } from "react";
import { AppBar, Divider, MenuItem, Toolbar, Typography } from "@mui/material";
import { CustomMenu } from "../styles/CustomMenu";
import { Link } from "@reach/router"
import { styled, Box } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const CustomLink = styled(Link)({
  color: '#FFF',
  borderRadius: 4,
  textDecoration: "none"
});

const Navbar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    console.log('hola');
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar sx={{ padding: "5px 190px", position: "static"}}>
      <Toolbar sx={{ width: "80%" }}>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <Link
            to="/"
            style={{ color: "#FFF", textDecoration: "none" }}
          >
            Simple<br/>WMS
          </Link>
        </Typography>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/almacen">Almacén</CustomLink>
        </Typography>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/inventario">Inventario</CustomLink>
        </Typography>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/pedidos">Pedidos</CustomLink>
        </Typography>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/productos">Productos</CustomLink>
        </Typography>
        <Box sx={{ flexGrow: 1, cursor: 'pointer', display: 'flex' }} onClick={handleClick}>
          <Typography variant="h5"  >
            Órdenes
          </Typography>
          <ArrowDropDownIcon />
        </Box>
        <CustomMenu
          sx={{ flexGrow: 1 }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem>        
            <CustomLink to="/ordenes/ingreso" onClick={handleClose}>Ingreso</CustomLink>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <CustomLink to="/ordenes/transporte" onClick={handleClose}>Transporte</CustomLink>
          </MenuItem>
          <Divider/>
          <MenuItem>
            <CustomLink to="/ordenes/despacho" onClick={handleClose}>Despacho</CustomLink>
          </MenuItem>
        </CustomMenu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
