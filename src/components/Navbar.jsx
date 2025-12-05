// src/components/Navbar.jsx
import { Home, CalendarDays, CalendarCheck, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="user-nav">
      <div className="nav-links">

        {/* Home */}
        <button
          className={`nav-link ${isActive('/home') ? 'active' : ''}`}
          onClick={() => navigate('/home')}
        >
          <Home />
          <span>Início</span>
        </button>

{/* Agendar */}
        <button
          className={`nav-link ${isActive('/booking') ? 'active' : ''}`}
          onClick={() => navigate('/booking')}
        >
          <CalendarDays />
          <span>Agendar</span>
        </button>

        {/* Meus Agendamentos */}
        <button
          className={`nav-link ${isActive('/my-appointments') ? 'active' : ''}`}
          onClick={() => navigate('/my-appointments')}
        >
          <CalendarCheck />
          <span>Agendados</span>
        </button>

        

        {/* Perfil */}
        <button
          className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          onClick={() => navigate('/profile')}
        >
          <User />
          <span>Perfil</span>
        </button>

        {/* Logout */}
        <button className="nav-link logout" onClick={handleLogout}>
          <LogOut />
          <span>Sair</span>
        </button>

      </div>
    </nav>
  );
}
