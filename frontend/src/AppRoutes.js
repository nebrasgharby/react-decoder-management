import { Routes, Route } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import Login from './pages/LoginPage';  // Fixed path
import Dashboard from './pages/DashboardPage';
import Clients from './pages/ClientsPage';  // Fixed path
import Decoders from './pages/DecodersPage';  // Fixed path
import Operations from './pages/OperationsPage';  // Fixed path
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/decoders" element={<Decoders />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;