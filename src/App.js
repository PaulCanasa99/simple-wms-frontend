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

const App = () => {
  moment.locale('es')

  return (
  <ThemeProvider theme={theme}>
    <Navbar/>
    <Router>
      <Login path="/"/>
      <Almacen path="/almacen"/>
      <Estanteria path="/almacen/:rack"/>
      <Inventario path="/inventario"/>
      <Pedidos path="/pedidos"/>
      <Productos path="/productos"/>
      <Ingreso path="/ordenes/ingreso"/>
  </Router>
  </ThemeProvider>
  );
}

export default App;
