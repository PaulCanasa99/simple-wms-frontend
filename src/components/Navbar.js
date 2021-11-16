import React, { useState, useContext } from "react";
import { AppBar, Divider, MenuItem, Toolbar, Typography } from "@mui/material";
import { CustomMenu } from "../styles/CustomMenu";
import { Link } from "@reach/router";
import { UserContext } from "../context/Context";
import { styled, Box } from '@mui/system';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import logo from '../assets/warehouse.svg';

const CustomLink = styled(Link)({
  color: '#FFF',
  borderRadius: 4,
  textDecoration: "none"
});

const Navbar = () => {
  const { userToken } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar sx={{ padding: "5px 60px", position: "static"}}>
      <Toolbar sx={{ width: "100%" }}>
        <img src={logo} alt='logo'/>
        <Typography variant="h5" sx={{ flexGrow: 1 }} ml={3}>
          <Link
            to={userToken ? "/almacen" : "/"}
            style={{ color: "#FFF", textDecoration: "none" }}
          >
            Simple<br/>WMS
          </Link>
        </Typography>
        {userToken ? ( 
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/almacen">Almacén</CustomLink>
        </Typography>
        ) : null}
        {userToken ? ( 
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/inventario">Inventario</CustomLink>
        </Typography>
        ) : null}
        {userToken ? ( 
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/pedidos">Pedidos</CustomLink>
        </Typography>
        ) : null}
        {userToken ? ( 
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          <CustomLink to="/productos">Productos</CustomLink>
        </Typography>
        ) : null}
        {userToken ? ( 
        <Box sx={{ flexGrow: 1, cursor: 'pointer', display: 'flex' }} onClick={handleClick}>
          <Typography variant="h5"  >
            Órdenes
          </Typography>
          <ArrowDropDownIcon />
        </Box>
        ) : null}
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
        {userToken ? (
          <Typography
            variant="h6"
            sx={{ flexGrow: 0.2 }}
          >
            <Link
              to="/"
              style={{
                color: "#FFF",
                textDecoration: "none",
                display: "flex",
              }}
            > 
              Cerrar sesión
              <MeetingRoomIcon
                style={{ alignSelf: "center", marginLeft: "10px" }}
              />
            </Link>
          </Typography>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
