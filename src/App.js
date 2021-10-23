import { ThemeProvider } from '@mui/material/styles';
import { Router } from "@reach/router"
import Almacen from './pages/Almacen/Almacen';
import Estanteria from './pages/Almacen/Estanteria';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import theme from './theme';
import Inventario from './pages/Inventario/Inventario';
import Pedidos from './pages/Pedidos/Pedidos';
import Productos from './pages/Productos/Productos';
import Ingreso from './pages/Ordenes/Ingreso/Ingreso';
import moment from 'moment'
import 'moment/locale/es'
import DetallePedido from './pages/Pedidos/DetallePedido';
import Kardex from './pages/Productos/Kardex';
import DateAdapter from '@mui/lab/AdapterMoment';
import { LocalizationProvider } from '@mui/lab';
import Despacho from './pages/Ordenes/Despacho/Despacho';
import DetalleIngreso from './pages/Ordenes/Ingreso/DetalleIngreso';
import DetalleDespacho from './pages/Ordenes/Despacho/DetalleDespacho';
import Transporte from './pages/Ordenes/Trasnporte/Transporte';

const App = () => {
  moment.locale('es')

  return (
  <ThemeProvider theme={theme}>
    <LocalizationProvider dateAdapter={DateAdapter}>
    <Navbar/>
    <Router>
      <Login path="/"/>
      <Almacen path="/almacen"/>
      <Estanteria path="/almacen/:rack"/>
      <Inventario path="/inventario"/>
      <Pedidos path="/pedidos"/>
      <DetallePedido path="/pedidos/:idPedido"/>
      <Productos path="/productos"/>
      <Kardex path="/productos/:idProducto"/>
      <Ingreso path="/ordenes/ingreso"/>
      <DetalleIngreso path="/ordenes/ingreso/:idOrden"/>
      <Despacho path="/ordenes/despacho"/>
      <DetalleDespacho path="/ordenes/despacho/:idOrden"/>
      <Transporte path="/ordenes/transporte"/>
    </Router>
    </LocalizationProvider>
  </ThemeProvider>
  );
}

export default App;
