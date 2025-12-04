import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Home, User, LogOut, XCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';
import authService from '../services/authService';
import './MyAppointments.css';

function MyAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userName = localStorage.getItem('userName') || 'Usuário';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/my-appointments');
      setAppointments(response.data.appointments || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Deseja cancelar este agendamento?')) return;
    try {
      await api.patch(`/appointments/${id}/cancel`);
      fetchAppointments();
      alert('Agendamento cancelado com sucesso!');
    } catch (error) {
      alert('Erro ao cancelar agendamento');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      cancelled: '#DC2626',
      completed: '#2563EB'
    };
    return colors[status] || '#6B7280';
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
    <div className="user-dashboard">
      <nav className="user-nav">
        <div className="nav-brand">
          <h2>💅 Vitoria Nail Designer</h2>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => navigate('/home')}>
            <Home size={20} />
            Início
          </button>
          <button className="nav-link" onClick={() => navigate('/services')}>
            <Calendar size={20} />
            Serviços
          </button>
          <button className="nav-link active" onClick={() => navigate('/my-appointments')}>
            <Clock size={20} />
            Meus Agendamentos
          </button>
          <button className="nav-link" onClick={() => navigate('/profile')}>
            <User size={20} />
            Perfil
          </button>
          <button className="nav-link logout" onClick={handleLogout}>
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </nav>

      <main className="user-content">
        <header className="page-header">
          <div>
            <h1>Meus Agendamentos</h1>
            <p>Olá, {userName}! Aqui estão seus agendamentos.</p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/booking')}>
            <Calendar size={18} />
            Novo Agendamento
          </button>
        </header>

        {loading ? (
          <div className="loading-state">Carregando...</div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <Calendar size={64} />
            <h3>Nenhum agendamento encontrado</h3>
            <p>Que tal agendar seu primeiro atendimento?</p>
            <button className="btn-primary" onClick={() => navigate('/booking')}>
              Agendar Agora
            </button>
          </div>
        ) : (
          <div className="appointments-grid">
            {appointments.map(apt => (
              <div key={apt._id} className="appointment-card">
                <div className="card-header">
                  <div className="service-name">{apt.service?.name}</div>
                  <span 
                    className="status-badge" 
                    style={{ background: `${getStatusColor(apt.status)}20`, color: getStatusColor(apt.status) }}
                  >
                    {getStatusText(apt.status)}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="info-row">
                    <Calendar size={18} />
                    <span>{new Date(apt.timeSlot?.date).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: '2-digit', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="info-row">
                    <Clock size={18} />
                    <span>{apt.timeSlot?.start_time} - {apt.timeSlot?.end_time}</span>
                  </div>
                  
                  <div className="info-row">
                    <span className="price">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(apt.service?.price)}
                    </span>
                    <span className="duration">{apt.service?.duration} min</span>
                  </div>

                  {apt.notes && (
                    <div className="notes">
                      <strong>Observações:</strong> {apt.notes}
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  {apt.status === 'pending' || apt.status === 'confirmed' ? (
                    <button className="btn-cancel" onClick={() => handleCancel(apt._id)}>
                      <XCircle size={18} />
                      Cancelar
                    </button>
                  ) : apt.status === 'completed' ? (
                    <div className="completed-badge">
                      <CheckCircle size={18} />
                      Atendimento realizado
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyAppointments;