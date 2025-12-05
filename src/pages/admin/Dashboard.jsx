import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from './components/AdminSidebar';
import AdminMobileHeader from './components/AdminMobileHeader';
import './AdminStyles.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalClients: 0,
    monthRevenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
    } catch {
      return '-';
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      cancelled: 'status-cancelled',
      completed: 'status-completed'
    };
    return classes[status] || 'status-pending';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      cancelled: 'Cancelado',
      completed: 'Concluído'
    };
    return texts[status] || status;
  };

  return (
    <div className="admin-layout">
      <AdminMobileHeader 
        onMenuClick={() => setSidebarOpen(true)} 
        pendingCount={stats.pendingAppointments}
      />
      
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="admin-main">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Visão geral do seu negócio</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon pink">
                <Calendar size={24} />
              </div>
              <span className="stat-trend up">
                <TrendingUp size={12} />
                12%
              </span>
            </div>
            <div className="stat-value">{stats.totalAppointments}</div>
            <div className="stat-label">Total de Agendamentos</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon orange">
                <Clock size={24} />
              </div>
            </div>
            <div className="stat-value">{stats.pendingAppointments}</div>
            <div className="stat-label">Pendentes</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon blue">
                <Users size={24} />
              </div>
              <span className="stat-trend up">
                <TrendingUp size={12} />
                8%
              </span>
            </div>
            <div className="stat-value">{stats.totalClients}</div>
            <div className="stat-label">Clientes Cadastrados</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <div className="stat-icon green">
                <DollarSign size={24} />
              </div>
              <span className="stat-trend up">
                <TrendingUp size={12} />
                23%
              </span>
            </div>
            <div className="stat-value">{formatCurrency(stats.monthRevenue)}</div>
            <div className="stat-label">Receita do Mês</div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="content-card">
          <div className="card-header">
            <h2>Agendamentos Recentes</h2>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/admin/appointments')}
            >
              Ver Todos
              <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando...</p>
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="empty-state">
              <Calendar size={48} />
              <h3>Nenhum agendamento</h3>
              <p>Os agendamentos aparecerão aqui</p>
            </div>
          ) : (
            <div className="appointments-list">
              {recentAppointments.map((apt) => (
                <div key={apt._id} className="appointment-item">
                  <div className="appointment-avatar">
                    {apt.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  
                  <div className="appointment-info">
                    <div className="appointment-name">{apt.user?.name || '-'}</div>
                    <div className="appointment-service">{apt.service?.name || '-'}</div>
                  </div>

                  <div className="appointment-meta">
                    <span>
                      <Calendar size={14} />
                      {formatDate(apt.timeSlot?.date)}
                    </span>
                    <span>
                      <Clock size={14} />
                      {apt.timeSlot?.start_time || '-'}
                    </span>
                  </div>

                  <span className={`status-badge ${getStatusClass(apt.status)}`}>
                    {getStatusText(apt.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
