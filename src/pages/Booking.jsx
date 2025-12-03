import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import './Booking.css';

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedService, selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/appointments/available-slots', {
        params: {
          date: selectedDate,
          serviceId: selectedService._id
        }
      });
      setAvailableSlots(response.data.slots);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedService || !selectedSlot) {
      alert('Selecione um serviço e um horário');
      return;
    }

    setLoading(true);
    try {
      await api.post('/appointments', {
        service_id: selectedService._id,
  time_slot_id: selectedSlot._id,
        notes
      });
      
      alert('Agendamento realizado com sucesso!');
      navigate('/my-appointments');
    } catch (error) {
      alert('Erro ao agendar: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Voltar
        </button>
        <h1>Novo Agendamento</h1>
      </div>

      <div className="booking-container">
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>1. Escolha o Serviço</h2>
            <div className="services-grid">
              {services.map(service => (
                <div
                  key={service._id}
                  className={`service-card ${selectedService?._id === service._id ? 'selected' : ''}`}
                  onClick={() => setSelectedService(service)}
                >
                  <h3>{service.name}</h3>
                  <p className="price">{formatPrice(service.price)}</p>
                  <p className="duration">
                    <Clock size={16} />
                    {service.duration} min
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedService && (
            <div className="form-section">
              <h2>2. Escolha a Data</h2>
              <input
                type="date"
                className="input"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot(null);
                }}
                min={getMinDate()}
                required
              />
            </div>
          )}

          {selectedDate && (
            <div className="form-section">
              <h2>3. Escolha o Horário</h2>
              {availableSlots.length === 0 ? (
                <p className="no-slots">Nenhum horário disponível para esta data</p>
              ) : (
                <div className="slots-grid">
                  {availableSlots.map(slot => (
                    <button
                      key={slot._id}
                      type="button"
                      className={`slot-btn ${selectedSlot?._id === slot._id ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.start_time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedSlot && (
            <>
              <div className="form-section">
                <h2>4. Observações (opcional)</h2>
                <textarea
                  className="input"
                  rows="4"
                  placeholder="Alguma observação ou preferência?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="summary">
                <h3>Resumo do Agendamento</h3>
                <div className="summary-item">
                  <span>Serviço:</span>
                  <strong>{selectedService.name}</strong>
                </div>
                <div className="summary-item">
                  <span>Data:</span>
                  <strong>{new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}</strong>
                </div>
                <div className="summary-item">
                  <span>Horário:</span>
                  <strong>{selectedSlot.start_time}</strong>
                </div>
                <div className="summary-item">
                  <span>Valor:</span>
                  <strong>{formatPrice(selectedService.price)}</strong>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Booking;