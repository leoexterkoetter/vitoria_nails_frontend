import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, User, Phone, DollarSign, X, Check, XCircle, CheckCircle, RefreshCw } from 'lucide-react';

const API_URL = 'http://localhost:3000/api';

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Estados para remanejamento
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedNewSlot, setSelectedNewSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token não encontrado');
        setAppointments([]);
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/admin/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📋 Resposta da API:', response.data);
      
      // Extrair array de agendamentos
      let appointmentsData = [];
      
      if (Array.isArray(response.data)) {
        appointmentsData = response.data;
      } else if (response.data && Array.isArray(response.data.appointments)) {
        appointmentsData = response.data.appointments;
      } else if (response.data && Array.isArray(response.data.data)) {
        appointmentsData = response.data.data;
      }
      
      console.log(`✅ ${appointmentsData.length} agendamentos carregados`);
      setAppointments(appointmentsData);
      
    } catch (err) {
      console.error('❌ Erro ao carregar:', err);
      setError(err.response?.data?.error || 'Erro ao carregar agendamentos');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/admin/appointments/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este agendamento?')) return;

    try {
      const token = localStorage.getItem('token');
      
      try {
        await axios.delete(`${API_URL}/admin/appointments/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (adminError) {
        if (adminError.response?.status === 404) {
          await axios.delete(`${API_URL}/appointments/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          throw adminError;
        }
      }
      
      alert('Excluído com sucesso!');
      fetchAppointments();
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleOpenReschedule = async (appointment) => {
    console.log('🔍 Abrindo remanejamento:', appointment);
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedNewSlot(null);

    try {
      const token = localStorage.getItem('token');
      const serviceId = appointment.service?._id || appointment.service;

      if (!serviceId) {
        throw new Error('ID do serviço não encontrado');
      }

      const response = await axios.get(`${API_URL}/appointments/available-slots`, {
        params: { serviceId },
        headers: { Authorization: `Bearer ${token}` }
      });

      let slots = Array.isArray(response.data) ? response.data : 
                  (response.data.slots || response.data.data || []);

      const currentSlotId = appointment.timeSlot?._id || appointment.timeSlot;
      const filteredSlots = slots.filter(slot => (slot._id || slot.id) !== currentSlotId);

      console.log(`📋 ${filteredSlots.length} slots disponíveis`);
      setAvailableSlots(filteredSlots);

    } catch (err) {
      console.error('❌ Erro ao buscar slots:', err);
      alert('Erro ao buscar horários: ' + (err.response?.data?.error || err.message));
      setIsRescheduleModalOpen(false);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedNewSlot) {
      alert('Selecione um novo horário');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const appointmentId = selectedAppointment._id || selectedAppointment.id;
      const newTimeSlotId = selectedNewSlot._id || selectedNewSlot.id;

      await axios.patch(
        `${API_URL}/appointments/${appointmentId}/reschedule`,
        { newTimeSlotId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Remanejado com sucesso!');
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
      setSelectedNewSlot(null);
      fetchAppointments();

    } catch (err) {
      console.error('❌ Erro ao remanejar:', err);
      alert('Erro ao remanejar: ' + (err.response?.data?.error || err.message));
    }
  };

  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach(slot => {
      const date = slot.date;
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(slot);
    });
    return grouped;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data inválida';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString.substring(0, 5);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: 'Pendente', class: 'admin-badge-pending', icon: Clock },
      confirmed: { text: 'Confirmado', class: 'admin-badge-confirmed', icon: CheckCircle },
      cancelled: { text: 'Cancelado', class: 'admin-badge-cancelled', icon: XCircle },
      completed: { text: 'Concluído', class: 'admin-badge-completed', icon: Check }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`admin-badge ${badge.class}`}>
        <Icon size={14} />
        {badge.text}
      </span>
    );
  };

  // Garantir que é array
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const filteredAppointments = safeAppointments.filter(apt => 
    filterStatus === 'all' || apt.status === filterStatus
  );

  // Loading state
  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">Carregando agendamentos...</div>
      </div>
    );
  }

  // Render principal
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gerenciar Agendamentos</h1>
        <div className="admin-filter-buttons">
          <button 
            className={filterStatus === 'all' ? 'active' : ''}
            onClick={() => setFilterStatus('all')}
          >
            Todos
          </button>
          <button 
            className={filterStatus === 'pending' ? 'active' : ''}
            onClick={() => setFilterStatus('pending')}
          >
            Pendentes
          </button>
          <button 
            className={filterStatus === 'confirmed' ? 'active' : ''}
            onClick={() => setFilterStatus('confirmed')}
          >
            Confirmados
          </button>
          <button 
            className={filterStatus === 'completed' ? 'active' : ''}
            onClick={() => setFilterStatus('completed')}
          >
            Concluídos
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error-message">{error}</div>
      )}

      <div className="admin-appointments-list">
        {filteredAppointments.length === 0 ? (
          <div className="admin-empty-state">
            <Calendar size={48} />
            <p>Nenhum agendamento encontrado</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => {
            if (!appointment || !appointment._id) return null;
            
            return (
              <div key={appointment._id} className="admin-appointment-card">
                <div className="admin-appointment-header">
                  <div className="admin-appointment-date">
                    <Calendar size={18} />
                    <span>
                      {appointment.timeSlot?.date 
                        ? new Date(appointment.timeSlot.date + 'T00:00:00').toLocaleDateString('pt-BR')
                        : 'Data não disponível'
                      }
                    </span>
                  </div>
                  {getStatusBadge(appointment.status)}
                </div>

                <div className="admin-appointment-body">
                  <div className="admin-appointment-info">
                    <User size={16} />
                    <span>{appointment.user?.name || 'Sem nome'}</span>
                  </div>

                  <div className="admin-appointment-info">
                    <Phone size={16} />
                    <span>{appointment.user?.phone || 'Sem telefone'}</span>
                  </div>

                  <div className="admin-appointment-info">
                    <Clock size={16} />
                    <span>
                      {formatTime(appointment.timeSlot?.start_time)} - {formatTime(appointment.timeSlot?.end_time)}
                    </span>
                  </div>

                  <div className="admin-appointment-service">
                    <strong>{appointment.service?.name || 'Sem serviço'}</strong>
                    <span className="admin-appointment-price">
                      <DollarSign size={14} />
                      R$ {(appointment.service?.price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="admin-appointment-actions">
                  {appointment.status === 'pending' && (
                    <>
                      <button 
                        className="admin-btn-confirm"
                        onClick={() => handleStatusChange(appointment._id, 'confirmed')}
                      >
                        <Check size={16} />
                        Confirmar
                      </button>
                      <button 
                        className="admin-btn-cancel"
                        onClick={() => handleStatusChange(appointment._id, 'cancelled')}
                      >
                        <X size={16} />
                        Cancelar
                      </button>
                    </>
                  )}

                  {appointment.status === 'confirmed' && (
                    <>
                      <button 
                        className="admin-btn-reschedule"
                        onClick={() => handleOpenReschedule(appointment)}
                      >
                        <RefreshCw size={16} />
                        Remanejar
                      </button>
                      <button 
                        className="admin-btn-complete"
                        onClick={() => handleStatusChange(appointment._id, 'completed')}
                      >
                        <Check size={16} />
                        Concluir
                      </button>
                    </>
                  )}

                  <button 
                    className="admin-btn-delete"
                    onClick={() => handleDelete(appointment._id)}
                  >
                    <X size={16} />
                    Excluir
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Remanejamento */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="admin-modal-overlay" onClick={() => setIsRescheduleModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Remanejar Agendamento</h2>
              <button 
                className="admin-modal-close"
                onClick={() => setIsRescheduleModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-current-appointment">
                <h3>Agendamento Atual</h3>
                <p><strong>Cliente:</strong> {selectedAppointment.user?.name}</p>
                <p><strong>Serviço:</strong> {selectedAppointment.service?.name}</p>
                <p><strong>Data:</strong> {selectedAppointment.timeSlot?.date 
                  ? new Date(selectedAppointment.timeSlot.date + 'T00:00:00').toLocaleDateString('pt-BR')
                  : 'N/A'
                }</p>
                <p><strong>Horário:</strong> {formatTime(selectedAppointment.timeSlot?.start_time)} - {formatTime(selectedAppointment.timeSlot?.end_time)}</p>
              </div>

              <div className="admin-new-slots">
                <h3>Selecione o Novo Horário</h3>
                
                {loadingSlots ? (
                  <div className="admin-loading">Carregando horários...</div>
                ) : availableSlots.length === 0 ? (
                  <div className="admin-empty-state">
                    <p>Nenhum horário disponível</p>
                  </div>
                ) : (
                  Object.entries(groupSlotsByDate(availableSlots)).map(([date, slots]) => (
                    <div key={date} className="admin-slots-date-group">
                      <h4>{formatDate(date)}</h4>
                      <div className="admin-slots-grid">
                        {slots.map(slot => (
                          <button
                            key={slot._id || slot.id}
                            className={`admin-slot-option ${selectedNewSlot?._id === slot._id ? 'selected' : ''}`}
                            onClick={() => setSelectedNewSlot(slot)}
                          >
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="admin-modal-footer">
              <button 
                className="admin-btn-secondary"
                onClick={() => setIsRescheduleModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className="admin-btn-primary"
                onClick={handleConfirmReschedule}
                disabled={!selectedNewSlot || loadingSlots}
              >
                Confirmar Remanejamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;