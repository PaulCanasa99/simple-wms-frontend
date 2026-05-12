import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { WarehousePage } from './pages/WarehousePage';
import { RackPage } from './pages/RackPage';
import { InventoryPage } from './pages/InventoryPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductLedgerPage } from './pages/ProductLedgerPage';
import { SalesOrdersPage } from './pages/SalesOrdersPage';
import { SalesOrderDetailPage } from './pages/SalesOrderDetailPage';
import { InboundPage } from './pages/InboundPage';
import { InboundDetailPage } from './pages/InboundDetailPage';
import { OutboundPage } from './pages/OutboundPage';
import { OutboundDetailPage } from './pages/OutboundDetailPage';
import { TransportPage } from './pages/TransportPage';

export const AppRouter = ({ demoMode }: { demoMode: boolean }) => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout demoMode={demoMode}>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route path="/almacen" element={<WarehousePage />} />
        <Route path="/almacen/:rack" element={<RackPage />} />
        <Route path="/inventario" element={<InventoryPage />} />
        <Route path="/productos" element={<ProductsPage />} />
        <Route path="/productos/:idProducto" element={<ProductLedgerPage />} />
        <Route path="/pedidos" element={<SalesOrdersPage />} />
        <Route path="/pedidos/:idPedido" element={<SalesOrderDetailPage />} />
        <Route path="/ordenes/ingreso" element={<InboundPage />} />
        <Route path="/ordenes/ingreso/:idOrden" element={<InboundDetailPage />} />
        <Route path="/ordenes/despacho" element={<OutboundPage />} />
        <Route path="/ordenes/despacho/:idOrden" element={<OutboundDetailPage />} />
        <Route path="/ordenes/transporte" element={<TransportPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);
