import { useEffect, useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Trash2,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from './components/AdminSidebar';
import AdminMobileHeader from './components/AdminMobileHeader';
import '../admin/AdminStyles.css';

export default function Appointments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const url = filter === 'all' 
        ? '/admin/appointments' 
        : `/admin/appointments?status=${filter}`;
      const response = await api.get(url);
      setAppointments(response.data.appointments || []);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;
    try {
      await api.delete(`/admin/appointments/${id}`);
      fetchAppointments();
    } catch (error) {
      alert('Erro ao excluir agendamento');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return '-';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'admin-status-pending',
      confirmed: 'admin-status-confirmed',
      cancelled: 'admin-status-cancelled',
      completed: 'admin-status-completed'
    };
    return classes[status] || classes.pending;
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

  const filters = [
    { label: 'Todos', value: 'all' },
    { label: 'Pendentes', value: 'pending' },
    { label: 'Confirmados', value: 'confirmed' },
    { label: 'Concluídos', value: 'completed' },
    { label: 'Cancelados', value: 'cancelled' }
  ];

  return (
    <div className="admin-layout">
      <AdminMobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Agendamentos</h1>
          <p>Gerencie todos os agendamentos do salão</p>
        </div>

        <div className="admin-content-card">
          {/* Filtros */}
          <div className="admin-filters-bar">
            <Filter size={18} style={{ color: '#94A3B8' }} />
            {filters.map((f) => (
              <button
                key={f.value}
                className={`admin-filter-chip ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Lista */}
          {loading ? (
            <div className="admin-loading-state">
              <div className="admin-spinner"></div>
              <p>Carregando agendamentos...</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="admin-empty-state">
              <Calendar size={48} />
              <h3>Nenhum agendamento encontrado</h3>
              <p>Não há agendamentos com este filtro</p>
            </div>
          ) : (
            <div className="admin-appointments-list">
              {appointments.map((apt) => (
                <div key={apt._id} className="admin-appointment-item">
                  <div className="admin-appointment-avatar">
                    {apt.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>

                  <div className="admin-appointment-info">
                    <div className="admin-appointment-name">
                      {apt.user?.name || '-'}
                      <span className={`admin-status-badge ${getStatusClass(apt.status)}`}>
                        {getStatusText(apt.status)}
                      </span>
                    </div>
                    <div className="admin-appointment-service">
                      {apt.service?.name || '-'} • {formatCurrency(apt.service?.price)}
                    </div>
                  </div>

                  <div className="admin-appointment-meta">
                    <span>
                      <Calendar size={14} />
                      {formatDate(apt.timeSlot?.date)}
                    </span>
                    <span>
                      <Clock size={14} />
                      {apt.timeSlot?.start_time || '-'}
                    </span>
                  </div>

                  <div className="admin-appointment-actions">
                    {apt.status === 'pending' && (
                      <>
                        <button
                          className="admin-btn admin-btn-success admin-btn-sm"
                          onClick={() => handleStatusChange(apt._id, 'confirmed')}
                          title="Confirmar"
                        >
                          <CheckCircle size={16} />
                          Confirmar
                        </button>
                        <button
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleStatusChange(apt._id, 'cancelled')}
                          title="Recusar"
                        >
                          <XCircle size={16} />
                          Cancelar
                        </button>
                      </>
                    )}
                    
                    {apt.status === 'confirmed' && (
                      <button
                        className="admin-btn admin-btn-primary admin-btn-sm"
                        onClick={() => handleStatusChange(apt._id, 'completed')}
                      >
                        <CheckCircle size={16} />
                        Concluir
                      </button>
                    )}

                    <button
                      className="admin-btn admin-btn-danger admin-btn-icon"
                      onClick={() => handleDelete(apt._id)}
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}