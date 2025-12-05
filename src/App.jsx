import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';

// Layout
import Navbar from './components/Navbar';

// Páginas
import Booking from './pages/Booking';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAppointments from './pages/admin/Appointments';
import AdminServices from './pages/admin/Services';
import AdminClients from './pages/admin/Clients';
import AdminTimeSlots from './pages/admin/TimeSlots';
import MyAppointments from './pages/MyAppointments';
import Profile from './pages/Profile';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import Services from './pages/Services';

import './styles/global.css';

// Rota protegida
function PrivateRoute({ children, adminOnly = false }) {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (adminOnly && !isAdmin) return <Navigate to="/home" />;

  return children;
}

// Layout com Navbar
function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// Página temporária
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
      <button className="btn btn-primary" onClick={() => window.history.back()}>
        Voltar
      </button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>

        {/* ROTAS PÚBLICAS */}
        <Route
          path="/"
          element={
            authService.isAuthenticated()
              ? <Navigate to="/home" />
              : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ROTAS COM NAVBAR */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <AppLayout><Home /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/services"
          element={
            <PrivateRoute>
              <AppLayout><Services /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <AppLayout><Booking /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <PrivateRoute>
              <AppLayout><MyAppointments /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AppLayout><Profile /></AppLayout>
            </PrivateRoute>
          }
        />

        {/* ROTAS ADMIN COM NAVBAR */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute adminOnly>
              <AppLayout><AdminDashboard /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/time-slots"
          element={
            <PrivateRoute adminOnly>
              <AppLayout><AdminTimeSlots /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <PrivateRoute adminOnly>
              <AppLayout><AdminServices /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/clients"
          element={
            <PrivateRoute adminOnly>
              <AppLayout><AdminClients /></AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <PrivateRoute adminOnly>
              <AppLayout><AdminAppointments /></AppLayout>
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
