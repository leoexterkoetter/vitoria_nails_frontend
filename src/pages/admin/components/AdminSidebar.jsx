import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Clock, 
  Users, 
  LogOut,
  X
} from 'lucide-react';
import authService from '../../services/authService';

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    onClose?.();
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { 
      section: 'Principal',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Calendar, label: 'Agendamentos', path: '/admin/appointments' },
      ]
    },
    {
      section: 'Gerenciamento',
      items: [
        { icon: Scissors, label: 'Serviços', path: '/admin/services' },
        { icon: Clock, label: 'Horários', path: '/admin/time-slots' },
        { icon: Users, label: 'Clientes', path: '/admin/clients' },
      ]
    }
  ];

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">💅</div>
            <div className="brand-text">
              <h2>Vitoria Nail</h2>
              <span>Painel Admin</span>
            </div>
          </div>
          <button className="mobile-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((section, idx) => (
            <div key={idx} className="nav-section">
              <span className="nav-section-title">{section.section}</span>
              {section.items.map((item) => (
                <button
                  key={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavigate(item.path)}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  );
}
