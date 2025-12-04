// frontend/src/pages/admin/Appointments.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, LogOut, Menu, X, ChevronRight, Bell, CheckCircle, XCircle, Filter } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Appointments() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showSidebar, setShowSidebar] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowSidebar(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [filter]);

  const fetchAppointments = async () => {
    try {
      const url = filter === 'all' ? '/admin/appointments' : `/admin/appointments?status=${filter}`;
      const response = await api.get(url);
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/admin/appointments/${id}/status`, { status: newStatus });
      fetchAppointments();
    } catch (error) {
      alert('Erro ao atualizar status');
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
    { icon: TrendingUp, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Calendar, label: 'Agendamentos', path: '/admin/appointments', active: true },
    { icon: Clock, label: 'Serviços', path: '/admin/services' },
    { icon: Clock, label: 'Horários', path: '/admin/time-slots' },
    { icon: Users, label: 'Clientes', path: '/admin/clients' }
  ];

  const filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendentes', value: 'pending' },
    { label: 'Confirmados', value: 'confirmed' },
    { label: 'Concluídos', value: 'completed' },
    { label: 'Cancelados', value: 'cancelled' }
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
            <span className="brand-text">Agendamentos</span>
          </div>
          <button className="notification-btn">
            <Bell size={20} />
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

      {/* Sidebar Overlay */}
      {isMobile && showSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowSidebar(false)} />
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div>
            <h1>Agendamentos</h1>
            <p>Gerencie todos os agendamentos</p>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <Filter size={18} />
          <div className="filters-scroll">
            {filters.map(f => (
              <button
                key={f.value}
                className={`filter-chip ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        <div className="appointments-list">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <p>Nenhum agendamento encontrado</p>
            </div>
          ) : (
            appointments.map(apt => {
              const statusConfig = getStatusConfig(apt.status);
              return (
                <div key={apt._id} className="appointment-card-detailed">
                  <div className="card-main">
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
                      {apt.notes && (
                        <div className="appointment-notes">
                          <strong>Obs:</strong> {apt.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  {(apt.status === 'pending' || apt.status === 'confirmed') && (
                    <div className="card-actions">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            className="action-btn confirm"
                            onClick={() => handleStatusChange(apt._id, 'confirmed')}
                          >
                            <CheckCircle size={18} />
                            Confirmar
                          </button>
                          <button
                            className="action-btn cancel"
                            onClick={() => handleStatusChange(apt._id, 'cancelled')}
                          >
                            <XCircle size={18} />
                            Cancelar
                          </button>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <button
                          className="action-btn complete"
                          onClick={() => handleStatusChange(apt._id, 'completed')}
                        >
                          <CheckCircle size={18} />
                          Concluir
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default Appointments;