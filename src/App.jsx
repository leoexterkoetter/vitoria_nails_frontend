import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import Booking from './pages/Booking';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminClients from './pages/admin/Clients';
import AdminTimeSlots from './pages/admin/TimeSlots';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';




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
      <Route path="/my-appointments" element={<PrivateRoute><MyAppointments /></PrivateRoute>} />
        <Route
  path="/profile"
  element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  }
/>

        {/* Rotas admin */}
       <Route path="/admin/dashboard" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/time-slots" element={<PrivateRoute adminOnly><AdminTimeSlots /></PrivateRoute>} />
              <Route path="/admin/services" element={<PrivateRoute adminOnly><AdminServices /></PrivateRoute>} />
     <Route path="/admin/clients" element={<PrivateRoute adminOnly><AdminClients /></PrivateRoute>} />
<Route path="/admin/appointments" element={<PrivateRoute adminOnly><AdminAppointments /></PrivateRoute>} />

        {/* 404 */}
        <Route path="*" element={<ComingSoon title="Página não encontrada" />} />
      </Routes>
    </Router>
  );
}

export default App;