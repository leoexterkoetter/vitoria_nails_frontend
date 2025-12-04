import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Users, Clock, TrendingUp, LogOut } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
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

  // FUNÇÃO HELPER PARA FORMATAR DATA CORRETAMENTE
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) return '-';
      
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return '-';
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>💅 Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active" onClick={() => navigate('/admin/dashboard')}>
            <TrendingUp size={20} />
            Dashboard
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/appointments')}>
            <Calendar size={20} />
            Agendamentos
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/services')}>
            <Clock size={20} />
            Serviços
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/time-slots')}>
            <Clock size={20} />
            Horários
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/clients')}>
            <Users size={20} />
            Clientes
          </button>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          Sair
        </button>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>Dashboard</h1>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: '#FFE5EE'}}>
              <Calendar size={24} color="#FF69B4" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Agendamentos</p>
              <p className="stat-value">{stats.totalAppointments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#FFF4E5'}}>
              <Clock size={24} color="#FFA500" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Pendentes</p>
              <p className="stat-value">{stats.pendingAppointments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#E5F4FF'}}>
              <Users size={24} color="#4A90E2" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Total Clientes</p>
              <p className="stat-value">{stats.totalClients}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#E5FFE5'}}>
              <DollarSign size={24} color="#4CAF50" />
            </div>
            <div className="stat-info">
              <p className="stat-label">Receita do Mês</p>
              <p className="stat-value">
                {new Intl.NumberFormat('pt-BR', { 
                  style: 'currency', 
                  currency: 'BRL' 
                }).format(stats.monthRevenue || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="recent-section">
          <h2>Agendamentos Recentes</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(recentAppointments) && recentAppointments.length > 0 ? (
                  recentAppointments.map(apt => (
                    <tr key={apt._id}>
                      <td>{apt.user?.name || '-'}</td>
                      <td>{apt.service?.name || '-'}</td>
                      <td>{formatDate(apt.timeSlot?.date)}</td>
                      <td>{apt.timeSlot?.start_time || '-'}</td>
                      <td>
                        <span className={`status-badge status-${apt.status}`}>
                          {apt.status === 'pending' ? 'Pendente' : 
                           apt.status === 'confirmed' ? 'Confirmado' : 
                           apt.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                      Nenhum agendamento encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;