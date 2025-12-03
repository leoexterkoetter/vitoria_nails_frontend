import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import Booking from './pages/Booking';

// Páginas de autenticação
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Páginas do usuário
import Home from './pages/Home';
import Services from './pages/Services';

// Páginas admin (criar depois)
// import AdminDashboard from './pages/admin/Dashboard';
// import ManageSchedule from './pages/admin/ManageSchedule';
// import ManageServices from './pages/admin/ManageServices';
// import ManageClients from './pages/admin/ManageClients';

import './styles/global.css';

// Componente para rotas protegidas
function PrivateRoute({ children, adminOnly = false }) {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" />;
  }

  return children;
}

// Página temporária até criar as outras
function ComingSoon({ title }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <h1>🎀 {title}</h1>
      <p>Página em construção...</p>
      <button 
        className="btn btn-primary"
        onClick={() => window.history.back()}
      >
        Voltar
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas do usuário */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          }
        />
       <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
        <Route
          path="/my-appointments"
          element={
            <PrivateRoute>
              <ComingSoon title="Meus Agendamentos" />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ComingSoon title="Perfil" />
            </PrivateRoute>
          }
        />

        {/* Rotas admin */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly>
              <ComingSoon title="Dashboard Admin" />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/schedule"
          element={
            <PrivateRoute adminOnly>
              <ComingSoon title="Gerenciar Horários" />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <PrivateRoute adminOnly>
              <ComingSoon title="Gerenciar Serviços" />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/clients"
          element={
            <PrivateRoute adminOnly>
              <ComingSoon title="Clientes" />
            </PrivateRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<ComingSoon title="Página não encontrada" />} />
      </Routes>
    </Router>
  );
}

export default App;