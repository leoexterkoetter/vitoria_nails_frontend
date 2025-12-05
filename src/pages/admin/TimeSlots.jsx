import { useEffect, useState } from 'react';
import { 
  Plus, 
  Trash2, 
  X,
  Clock,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import AdminSidebar from './components/AdminSidebar';
import AdminMobileHeader from './components/AdminMobileHeader';
import './AdminStyles.css';

export default function TimeSlots() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '',
    start_time: '',
    end_time: ''
  });

  const [batchData, setBatchData] = useState({
    start_date: '',
    end_date: '',
    times: [
      { start_time: '09:00', end_time: '10:00' },
      { start_time: '10:00', end_time: '11:00' },
      { start_time: '11:00', end_time: '12:00' },
      { start_time: '14:00', end_time: '15:00' },
      { start_time: '15:00', end_time: '16:00' },
      { start_time: '16:00', end_time: '17:00' },
      { start_time: '17:00', end_time: '18:00' }
    ]
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await api.get('/admin/time-slots');
      setSlots(response.data.slots || []);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/time-slots', formData);
      setShowModal(false);
      resetForm();
      fetchSlots();
      alert('Horário criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar horário');
    }
  };

  const handleSubmitBatch = async (e) => {
    e.preventDefault();
    try {
      const start = new Date(batchData.start_date + 'T00:00:00');
      const end = new Date(batchData.end_date + 'T00:00:00');
      
      let created = 0;
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        
        for (const time of batchData.times) {
          try {
            await api.post('/admin/time-slots', {
              date: dateStr,
              start_time: time.start_time,
              end_time: time.end_time
            });
            created++;
          } catch (err) {
            console.log('Slot já existe ou erro:', err);
          }
        }
      }

      setShowModal(false);
      resetForm();
      fetchSlots();
      alert(`${created} horários criados com sucesso!`);
    } catch (error) {
      alert('Erro ao criar horários');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Excluir este horário?')) return;
    try {
      await api.delete(`/admin/time-slots/${id}`);
      fetchSlots();
    } catch (error) {
      alert('Erro ao excluir horário');
    }
  };

  const handleDeleteDay = async (dateSlots) => {
    if (!window.confirm(`Excluir todos os ${dateSlots.length} horários deste dia?`)) return;
    try {
      for (const slot of dateSlots) {
        await api.delete(`/admin/time-slots/${slot._id}`);
      }
      fetchSlots();
      alert('Horários excluídos com sucesso!');
    } catch (error) {
      alert('Erro ao excluir horários');
    }
  };

  const resetForm = () => {
    setFormData({ date: '', start_time: '', end_time: '' });
    setBatchMode(false);
  };

  const addTimeSlot = () => {
    setBatchData({
      ...batchData,
      times: [...batchData.times, { start_time: '09:00', end_time: '10:00' }]
    });
  };

  const removeTimeSlot = (index) => {
    setBatchData({
      ...batchData,
      times: batchData.times.filter((_, i) => i !== index)
    });
  };

  const updateTimeSlot = (index, field, value) => {
    const newTimes = [...batchData.times];
    newTimes[index][field] = value;
    setBatchData({ ...batchData, times: newTimes });
  };

  // Agrupa slots por data
  const groupedSlots = slots.reduce((acc, slot) => {
    const date = new Date(slot.date).toLocaleDateString('pt-BR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

  return (
    <div className="admin-layout">
      <AdminMobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <div className="page-header">
          <h1>Horários</h1>
          <p>Gerencie os horários disponíveis para agendamento</p>
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Criar Horários
            </button>
          </div>
        </div>

        <div className="content-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Carregando horários...</p>
            </div>
          ) : Object.keys(groupedSlots).length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <h3>Nenhum horário cadastrado</h3>
              <p>Adicione horários para que clientes possam agendar</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus size={18} />
                Criar Horários
              </button>
            </div>
          ) : (
            <div className="timeslots-container">
              {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                <div key={date} className="date-group">
                  <div className="date-group-header">
                    <h3>
                      <Calendar size={18} />
                      {date}
                    </h3>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteDay(dateSlots)}
                    >
                      <Trash2 size={14} />
                      Apagar Dia
                    </button>
                  </div>

                  <div className="slots-grid">
                    {dateSlots.map((slot) => (
                      <div key={slot._id} className="slot-card">
                        <div>
                          <div className="slot-time">
                            {slot.start_time} - {slot.end_time}
                          </div>
                          <span className={`slot-status ${slot.available ? 'available' : 'occupied'}`}>
                            {slot.available ? 'Disponível' : 'Ocupado'}
                          </span>
                        </div>
                        <button 
                          className="slot-delete"
                          onClick={() => handleDelete(slot._id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
              <div className="modal-header">
                <h2>Criar Horários</h2>
                <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                {/* Mode Switch */}
                <div className="mode-switch">
                  <button
                    type="button"
                    className={`mode-btn ${!batchMode ? 'active' : ''}`}
                    onClick={() => setBatchMode(false)}
                  >
                    Único
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${batchMode ? 'active' : ''}`}
                    onClick={() => setBatchMode(true)}
                  >
                    Em Lote
                  </button>
                </div>

                {!batchMode ? (
                  <form onSubmit={handleSubmitSingle}>
                    <div className="form-group">
                      <label className="form-label">Data *</label>
                      <input
                        type="date"
                        className="form-input"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Início *</label>
                        <input
                          type="time"
                          className="form-input"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Fim *</label>
                        <input
                          type="time"
                          className="form-input"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Criar Horário
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleSubmitBatch}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Data Início *</label>
                        <input
                          type="date"
                          className="form-input"
                          value={batchData.start_date}
                          onChange={(e) => setBatchData({ ...batchData, start_date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Data Fim *</label>
                        <input
                          type="date"
                          className="form-input"
                          value={batchData.end_date}
                          onChange={(e) => setBatchData({ ...batchData, end_date: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Horários do Dia</label>
                      <div className="times-list">
                        {batchData.times.map((time, index) => (
                          <div key={index} className="time-item">
                            <input
                              type="time"
                              value={time.start_time}
                              onChange={(e) => updateTimeSlot(index, 'start_time', e.target.value)}
                            />
                            <span>até</span>
                            <input
                              type="time"
                              value={time.end_time}
                              onChange={(e) => updateTimeSlot(index, 'end_time', e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn-remove"
                              onClick={() => removeTimeSlot(index)}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={addTimeSlot}
                      >
                        <Plus size={14} />
                        Adicionar Horário
                      </button>
                    </div>

                    <div className="modal-footer" style={{ padding: '16px 0 0', borderTop: 'none' }}>
                      <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                        Cancelar
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Criar Horários
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
