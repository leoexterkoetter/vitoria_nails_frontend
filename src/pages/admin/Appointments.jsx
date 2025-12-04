import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, LogOut, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Appointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
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

  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>💅 Admin</h2>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/admin/dashboard')}>
            <TrendingUp size={20} />
            Dashboard
          </button>
          <button className="nav-item active" onClick={() => navigate('/admin/appointments')}>
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
          <h1>Gerenciar Agendamentos</h1>
        </header>

        <div className="filters-row">
          <button className={filter === 'all' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('all')}>
            Todos
          </button>
          <button className={filter === 'pending' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('pending')}>
            Pendentes
          </button>
          <button className={filter === 'confirmed' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('confirmed')}>
            Confirmados
          </button>
          <button className={filter === 'completed' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('completed')}>
            Concluídos
          </button>
          <button className={filter === 'cancelled' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('cancelled')}>
            Cancelados
          </button>
        </div>

        <div className="table-card">
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Serviço</th>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt._id}>
                    <td>
                      <div>
                        <div className="table-name">{apt.user?.name}</div>
                        <div className="table-sub">{apt.user?.email}</div>
                      </div>
                    </td>
                    <td>{apt.service?.name}</td>
                    <td>{new Date(apt.timeSlot?.date).toLocaleDateString('pt-BR')}</td>
                    <td>{apt.timeSlot?.start_time}</td>
                    <td>
                      <span className={`status-badge status-${apt.status}`}>
                        {apt.status === 'pending' ? 'Pendente' : 
                         apt.status === 'confirmed' ? 'Confirmado' : 
                         apt.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {apt.status === 'pending' && (
                          <>
                            <button className="icon-btn success" onClick={() => handleStatusChange(apt._id, 'confirmed')} title="Confirmar">
                              <CheckCircle size={18} />
                            </button>
                            <button className="icon-btn danger" onClick={() => handleStatusChange(apt._id, 'cancelled')} title="Cancelar">
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button className="icon-btn primary" onClick={() => handleStatusChange(apt._id, 'completed')} title="Concluir">
                            <CheckCircle size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Appointments;