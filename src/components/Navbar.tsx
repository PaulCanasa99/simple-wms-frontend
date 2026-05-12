import { useState, type MouseEvent } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Divider,
  MenuItem,
  Toolbar,
  Typography,
  styled,
  Menu,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthContext';
import warehouseLogo from '../assets/warehouse.svg';
import { LanguageSwitcher } from './LanguageSwitcher';

const NavLink = styled(RouterLink)({
  color: '#FFF',
  borderRadius: 4,
  textDecoration: 'none',
});

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    backgroundColor: theme.palette.primary.main,
  },
}));

export const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated, clearSession } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <AppBar sx={{ padding: '5px 60px', position: 'static' }}>
      <Toolbar sx={{ width: '100%', gap: 2 }}>
        <img src={warehouseLogo} alt="logo" width={40} />
        <Typography variant="h5" sx={{ flexGrow: 1 }} ml={3}>
          <NavLink to={isAuthenticated ? '/almacen' : '/'}>
            Simple
            <br />
            WMS
          </NavLink>
        </Typography>

        {isAuthenticated && (
          <>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              <NavLink to="/almacen">{t('nav.warehouse')}</NavLink>
            </Typography>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              <NavLink to="/inventario">{t('nav.inventory')}</NavLink>
            </Typography>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              <NavLink to="/pedidos">{t('nav.salesOrders')}</NavLink>
            </Typography>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              <NavLink to="/productos">{t('nav.products')}</NavLink>
            </Typography>

            <Box
              sx={{ flexGrow: 1, cursor: 'pointer', display: 'flex' }}
              onClick={handleOpen}
            >
              <Typography variant="h5">{t('nav.operations')}</Typography>
              <ArrowDropDownIcon />
            </Box>

            <StyledMenu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}>
                <NavLink to="/ordenes/ingreso">{t('nav.inbound')}</NavLink>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <NavLink to="/ordenes/transporte">{t('nav.transport')}</NavLink>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClose}>
                <NavLink to="/ordenes/despacho">{t('nav.outbound')}</NavLink>
              </MenuItem>
            </StyledMenu>
          </>
        )}

        <LanguageSwitcher />

        {isAuthenticated && (
          <Typography
            variant="h6"
            sx={{ flexGrow: 0.2, cursor: 'pointer' }}
            onClick={handleLogout}
          >
            <Box display="flex" alignItems="center" color="white">
              {t('nav.logout')}
              <MeetingRoomIcon style={{ alignSelf: 'center', marginLeft: 8 }} />
            </Box>
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};
