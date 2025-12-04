import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Clock, TrendingUp, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalClients: 0,
    monthRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/appointments?limit=5')
      ]);

      setStats(statsRes.data);
      setRecentAppointments(appointmentsRes.data.appointments || []);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
    } catch (error) {
      return '-';
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { text: 'Pendente', color: '#F59E0B', bg: '#FEF3C7' },
      confirmed: { text: 'Confirmado', color: '#10B981', bg: '#D1FAE5' },
      cancelled: { text: 'Cancelado', color: '#EF4444', bg: '#FEE2E2' },
      completed: { text: 'Concluído', color: '#3B82F6', bg: '#DBEAFE' }
    };
    return configs[status] || configs.pending;
  };

  return (
    <div className="mobile-dashboard">
      {/* Top Bar */}
      <header className="mobile-header">
        <div className="header-content">
          <div className="header-left">
            <h1>💅 Admin</h1>
            <p>Dashboard</p>
          </div>
          <button className="menu-toggle" onClick={() => setShowMenu(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {showMenu && (
        <div className="menu-overlay" onClick={() => setShowMenu(false)}>
          <div className="menu-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>💅 Menu</h2>
              <button className="close-menu" onClick={() => setShowMenu(false)}>
                <X size={24} />
              </button>
            </div>
            
            <nav className="drawer-nav">
              <button className="drawer-item active" onClick={() => { navigate('/admin/dashboard'); setShowMenu(false); }}>
                <TrendingUp size={20} />
                <span>Dashboard</span>
                <ChevronRight size={18} />
              </button>
              <button className="drawer-item" onClick={() => { navigate('/admin/appointments'); setShowMenu(false); }}>
                <Calendar size={20} />
                <span>Agendamentos</span>
                <ChevronRight size={18} />
              </button>
              <button className="drawer-item" onClick={() => { navigate('/admin/services'); setShowMenu(false); }}>
                <Clock size={20} />
                <span>Serviços</span>
                <ChevronRight size={18} />
              </button>
              <button className="drawer-item" onClick={() => { navigate('/admin/time-slots'); setShowMenu(false); }}>
                <Clock size={20} />
                <span>Horários</span>
                <ChevronRight size={18} />
              </button>
              <button className="drawer-item" onClick={() => { navigate('/admin/clients'); setShowMenu(false); }}>
                <Users size={20} />
                <span>Clientes</span>
                <ChevronRight size={18} />
              </button>
            </nav>

            <button className="drawer-logout" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="mobile-content">
        {/* Stats Grid */}
        <div className="stats-grid-mobile">
          <div className="stat-card-mobile stat-pink">
            <div className="stat-value">{stats.totalAppointments}</div>
            <div className="stat-label">
              <Calendar size={18} />
              Total Agendamentos
            </div>
          </div>

          <div className="stat-card-mobile stat-orange">
            <div className="stat-value">{stats.pendingAppointments}</div>
            <div className="stat-label">
              <Clock size={18} />
              Pendentes
            </div>
          </div>

          <div className="stat-card-mobile stat-blue">
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-label">
              <Users size={18} />
              Total Clientes
            </div>
          </div>

          <div className="stat-card-mobile stat-green">
            <div className="stat-value">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                maximumFractionDigits: 0
              }).format(stats.monthRevenue || 0)}
            </div>
            <div className="stat-label">
              <DollarSign size={18} />
              Receita do Mês
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <section className="appointments-section">
          <div className="section-header-mobile">
            <h2>Agendamentos Recentes</h2>
            <button className="view-all-btn-mobile" onClick={() => navigate('/admin/appointments')}>
              Ver Todos
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="appointments-list-mobile">
            {Array.isArray(recentAppointments) && recentAppointments.length > 0 ? (
              recentAppointments.map(apt => {
                const statusConfig = getStatusConfig(apt.status);
                return (
                  <div key={apt._id} className="appointment-card-mobile">
                    <div className="appointment-header-mobile">
                      <div className="client-info">
                        <div className="client-avatar">
                          {apt.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="client-details">
                          <div className="client-name">{apt.user?.name || '-'}</div>
                          <div className="service-name">{apt.service?.name || '-'}</div>
                        </div>
                      </div>
                      <span 
                        className="status-badge-mobile" 
                        style={{ 
                          background: statusConfig.bg, 
                          color: statusConfig.color 
                        }}
                      >
                        {statusConfig.text}
                      </span>
                    </div>
                    
                    <div className="appointment-details-mobile">
                      <div className="detail-item">
                        <Calendar size={16} />
                        <span>{formatDate(apt.timeSlot?.date)}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <span>{apt.timeSlot?.start_time || '-'}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state-mobile">
                <Calendar size={48} />
                <p>Nenhum agendamento recente</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <button className="nav-btn active" onClick={() => navigate('/admin/dashboard')}>
          <TrendingUp size={22} />
          <span>Dashboard</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/admin/appointments')}>
          <Calendar size={22} />
          <span>Agendamentos</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/admin/services')}>
          <Clock size={22} />
          <span>Serviços</span>
        </button>
        <button className="nav-btn" onClick={() => navigate('/admin/clients')}>
          <Users size={22} />
          <span>Clientes</span>
        </button>
      </nav>
    </div>
  );
}

export default Dashboard;