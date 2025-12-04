import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Clock, TrendingUp, LogOut, Menu, X, ChevronRight, Bell } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalClients: 0,
    monthRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        month: 'short',
        year: isMobile ? undefined : 'numeric'
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

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', path: '/admin/dashboard', active: true },
    { icon: Calendar, label: 'Agendamentos', path: '/admin/appointments' },
    { icon: Clock, label: 'Serviços', path: '/admin/services' },
    { icon: Clock, label: 'Horários', path: '/admin/time-slots' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' }
  ];

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      {isMobile && (
        <header className="mobile-header">
          <button className="menu-btn" onClick={() => setShowSidebar(true)}>
            <Menu size={24} />
          </button>
          <div className="header-brand">
            <span className="brand-emoji">💅</span>
            <span className="brand-text">Admin</span>
          </div>
          <button className="notification-btn">
            <Bell size={20} />
            {stats.pendingAppointments > 0 && (
              <span className="notification-badge">{stats.pendingAppointments}</span>
            )}
          </button>
        </header>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <span className="brand-emoji-large">💅</span>
              <div>
                <h2>Vitoria Nail</h2>
                <p>Painel Admin</p>
              </div>
            </div>
            {isMobile && (
              <button className="close-sidebar" onClick={() => setShowSidebar(false)}>
                <X size={24} />
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`nav-item ${item.active ? 'active' : ''}`}
                onClick={() => {
                  navigate(item.path);
                  setShowSidebar(false);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
                {isMobile && <ChevronRight size={18} className="nav-arrow" />}
              </button>
            ))}
          </nav>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Overlay (Mobile) */}
      {isMobile && showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div>
            <h1>Dashboard</h1>
            <p>Visão geral do seu negócio</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-icon">
              <Calendar size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Agendamentos</span>
              <span className="stat-value">{stats.totalAppointments}</span>
            </div>
          </div>

          <div className="stat-card stat-warning">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Pendentes</span>
              <span className="stat-value">{stats.pendingAppointments}</span>
            </div>
          </div>

          <div className="stat-card stat-info">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Clientes</span>
              <span className="stat-value">{stats.totalClients}</span>
            </div>
          </div>

          <div className="stat-card stat-success">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Receita do Mês</span>
              <span className="stat-value">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL',
                  maximumFractionDigits: 0
                }).format(stats.monthRevenue || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <section className="appointments-section">
          <div className="section-header">
            <h2>Agendamentos Recentes</h2>
            <button 
              className="btn-view-all"
              onClick={() => navigate('/admin/appointments')}
            >
              Ver Todos
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="appointments-list">
            {Array.isArray(recentAppointments) && recentAppointments.length > 0 ? (
              recentAppointments.map(apt => {
                const statusConfig = getStatusConfig(apt.status);
                return (
                  <div key={apt._id} className="appointment-card">
                    <div className="appointment-avatar">
                      {apt.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="appointment-details">
                      <div className="appointment-client">
                        <span className="client-name">{apt.user?.name || '-'}</span>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: statusConfig.bg,
                            color: statusConfig.color
                          }}
                        >
                          {statusConfig.text}
                        </span>
                      </div>
                      <div className="appointment-service">
                        {apt.service?.name || '-'}
                      </div>
                      <div className="appointment-meta">
                        <span className="meta-item">
                          <Calendar size={14} />
                          {formatDate(apt.timeSlot?.date)}
                        </span>
                        <span className="meta-item">
                          <Clock size={14} />
                          {apt.timeSlot?.start_time || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <Calendar size={48} />
                <p>Nenhum agendamento recente</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;