import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import api from '../services/api';
import './Booking.css';


export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem('userName') || 'Cliente';

  const [brokenNail, setBrokenNail] = useState(null);
  const [brokenNailNotes, setBrokenNailNotes] = useState('');

  // controla qual etapa está aberta (1,2,3,4,5)
  const [openStep, setOpenStep] = useState(1);

  // refs para scroll automático
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  const scrollTo = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  // ---- FETCHS ----
  useEffect(() => { fetchServices(); }, []);

  useEffect(() => {
    if (selectedService && selectedDate) fetchAvailableSlots();
    else setAvailableSlots([]);
  }, [selectedService, selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data.services || []);
    } catch (err) {
      console.error('Erro ao buscar serviços:', err);
      setServices([]);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await api.get('/appointments/available-slots', {
        params: {
          date: selectedDate,
          serviceId: selectedService._id || selectedService.id
        }
      });

      const slots = Array.isArray(response.data)
        ? response.data
        : response.data.slots || [];

      setAvailableSlots(slots);

      setOpenStep(3);
      scrollTo(step3Ref);
    } catch (err) {
      console.error('Erro ao buscar horários:', err);
      setAvailableSlots([]);
    }
  };

  // ---- HANDLERS ----

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // permite escolher HOJE
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  const formatTime = (time) => time?.slice(0, 5) || '';

  const handleSelectService = (service) => {
    setSelectedService(service);
    setSelectedDate('');
    setSelectedSlot(null);
    setBrokenNail(null);
    setBrokenNailNotes('');
    setOpenStep(2);
    scrollTo(step2Ref);
  };

  const handleDateSelect = (value) => {
    setSelectedDate(value);
    setSelectedSlot(null);
    setOpenStep(3);
    scrollTo(step3Ref);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setOpenStep(4);
    scrollTo(step4Ref);
  };

  const handleBrokenNail = (value) => {
    setBrokenNail(value);
    setOpenStep(5);
    scrollTo(step5Ref);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedSlot) return alert('Selecione um serviço e horário');

    setLoading(true);
    try {
      await api.post('/appointments', {
        serviceId: selectedService._id || selectedService.id,
        timeSlotId: selectedSlot._id || selectedSlot.id,
        brokenNail,
        brokenNailNotes
      });

      alert('Agendamento solicitado com sucesso!');
      navigate('/my-appointments');
    } catch (err) {
      alert('Erro ao agendar: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Voltar
        </button>
        <h1><Sparkles size={20} /> Olá, {userName}! Agende seu horário</h1>
      </div>

      <div className="booking-container">
        <form onSubmit={handleSubmit} className="booking-form">

          {/* --- STEP 1 --- */}
          <div className="form-section" ref={step1Ref}>
            <h2>1. Escolha o Serviço</h2>

            <div className="services-grid">
              {services.map(service => (
                <div
                  key={service._id || service.id}
                  className={`service-card ${
                    selectedService?._id === service._id ||
                    selectedService?.id === service.id
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleSelectService(service)}
                >
                  <div className="service-card-header">
                    💅 <h3>{service.name}</h3>
                  </div>
                  <p className="price">{formatPrice(service.price)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* --- STEP 2 --- */}
          {openStep >= 2 && (
            <div className="form-section fade-in" ref={step2Ref}>
              <h2>2. Escolha a Data</h2>

              <input
                type="date"
                className="input date-input"
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                min={getMinDate()}
                required
              />
            </div>
          )}

          {/* --- STEP 3 --- */}
          {openStep >= 3 && selectedDate && (
            <div className="form-section fade-in" ref={step3Ref}>
              <h2>3. Escolha o Horário</h2>

              {availableSlots.length === 0 ? (
                <p className="no-slots">Nenhum horário disponível</p>
              ) : (
                <div className="slots-grid">
                  {availableSlots.map(slot => (
                    <button
                      key={slot._id || slot.id}
                      type="button"
                      className={`slot-btn ${
                        selectedSlot?._id === slot._id ||
                        selectedSlot?.id === slot.id
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      {formatTime(slot.start_time)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* --- STEP 4 --- */}
          {openStep >= 4 && selectedSlot && (
            <div className="form-section fade-in" ref={step4Ref}>
              <h2>4. Unhas Danificadas</h2>

              <p className="question-text">Alguma unha quebrada que precise novo alongamento?</p>

              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="brokenNail"
                    value="sim"
                    onChange={() => handleBrokenNail(true)}
                    checked={brokenNail === true}
                  />
                  Sim
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="brokenNail"
                    value="nao"
                    onChange={() => handleBrokenNail(false)}
                    checked={brokenNail === false}
                  />
                  Não
                </label>
              </div>

              {brokenNail && (
                <div className="broken-nail-box fade-in">
                  <p className="warning-text">
                    ⚠️ Pode haver taxa adicional de <strong>R$5,00</strong> por unha.
                  </p>

                  <textarea
                    className="input textarea"
                    rows="3"
                    placeholder="Quantas unhas estão danificadas? (opcional)"
                    value={brokenNailNotes}
                    onChange={(e) => setBrokenNailNotes(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* --- STEP 5 --- */}
          {openStep >= 5 && (
            <div className="fade-in" ref={step5Ref}>
              <div className="summary">
                <h3>Resumo do Agendamento</h3>

                <div className="summary-item">
                  <span>Serviço:</span>
                  <strong>{selectedService?.name}</strong>
                </div>

                <div className="summary-item">
                  <span>Data:</span>
                  <strong>{new Date(selectedDate + 'T00:00:00')
                    .toLocaleDateString('pt-BR')}</strong>
                </div>

                <div className="summary-item">
                  <span>Horário:</span>
                  <strong>{formatTime(selectedSlot?.start_time)}</strong>
                </div>

                <div className="summary-item">
                  <span>Valor:</span>
                  <strong>{formatPrice(selectedService?.price)}</strong>
                </div>
              </div>

              <button type="submit" className="btn-primary confirm-btn pulse" disabled={loading}>
                {loading ? 'Agendando...' : 'Confirmar Agendamento'}
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
