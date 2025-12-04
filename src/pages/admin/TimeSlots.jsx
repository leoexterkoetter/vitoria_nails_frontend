import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, LogOut, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function TimeSlots() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
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
    }
  };

  const handleSubmitSingle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/time-slots', formData); // Enviar date direto como string
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
            console.log('Erro:', err);
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
    if (!confirm('Tem certeza que deseja deletar este horário?')) return;
    try {
      await api.delete(`/admin/time-slots/${id}`);
      fetchSlots();
    } catch (error) {
      alert('Erro ao deletar horário');
    }
  };

  const handleDeleteDay = async (date, dateSlots) => {
    if (!confirm(`Apagar TODOS os ${dateSlots.length} horários de ${date}?`)) return;
    try {
      let deleted = 0;
      for (const slot of dateSlots) {
        try {
          await api.delete(`/admin/time-slots/${slot._id}`);
          deleted++;
        } catch (err) {
          console.error('Erro ao deletar:', err);
        }
      }
      fetchSlots();
      alert(`${deleted} horários deletados com sucesso!`);
    } catch (error) {
      alert('Erro ao apagar horários');
    }
  };

  const resetForm = () => {
    setFormData({ date: '', start_time: '', end_time: '' });
    setBatchMode(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const date = new Date(slot.date).toLocaleDateString('pt-BR');
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {});

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
          <button className="nav-item" onClick={() => navigate('/admin/appointments')}>
            <Calendar size={20} />
            Agendamentos
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/services')}>
            <Clock size={20} />
            Serviços
          </button>
          <button className="nav-item active" onClick={() => navigate('/admin/time-slots')}>
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
          <h1>Gerenciar Horários</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Criar Horários
          </button>
        </header>

        <div className="slots-container">
          {Object.keys(groupedSlots).length === 0 ? (
            <div className="empty-state">
              <Clock size={48} />
              <p>Nenhum horário cadastrado</p>
            </div>
          ) : (
            Object.entries(groupedSlots).map(([date, dateSlots]) => (
              <div key={date} className="date-group">
                <div className="date-header-row">
                  <h3 className="date-header">{date}</h3>
                  <button 
                    className="btn-danger-small" 
                    onClick={() => handleDeleteDay(date, dateSlots)}
                  >
                    <Trash2 size={16} />
                    Apagar Dia
                  </button>
                </div>
                <div className="slots-grid">
                  {dateSlots.map(slot => (
                    <div key={slot._id} className="slot-card">
                      <div className="slot-time">
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <span className={`slot-badge ${slot.available ? 'available' : 'unavailable'}`}>
                        {slot.available ? 'Disponível' : 'Ocupado'}
                      </span>
                      <button className="slot-delete" onClick={() => handleDelete(slot._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Criar Horários</h2>
                <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                  <X size={24} />
                </button>
              </div>

              <div className="mode-switch">
                <button
                  className={!batchMode ? 'mode-btn active' : 'mode-btn'}
                  onClick={() => setBatchMode(false)}
                >
                  Único
                </button>
                <button
                  className={batchMode ? 'mode-btn active' : 'mode-btn'}
                  onClick={() => setBatchMode(true)}
                >
                  Em Lote
                </button>
              </div>

              {!batchMode ? (
                <form onSubmit={handleSubmitSingle}>
                  <div className="form-group">
                    <label>Data *</label>
                    <input
                      type="date"
                      className="input"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Horário Início *</label>
                      <input
                        type="time"
                        className="input"
                        value={formData.start_time}
                        onChange={e => setFormData({...formData, start_time: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Horário Fim *</label>
                      <input
                        type="time"
                        className="input"
                        value={formData.end_time}
                        onChange={e => setFormData({...formData, end_time: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
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
                      <label>Data Início *</label>
                      <input
                        type="date"
                        className="input"
                        value={batchData.start_date}
                        onChange={e => setBatchData({...batchData, start_date: e.target.value})}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Data Fim *</label>
                      <input
                        type="date"
                        className="input"
                        value={batchData.end_date}
                        onChange={e => setBatchData({...batchData, end_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Horários do Dia</label>
                    <div className="times-list">
                      {batchData.times.map((time, index) => (
                        <div key={index} className="time-item">
                          <input
                            type="time"
                            className="input-small"
                            value={time.start_time}
                            onChange={e => {
                              const newTimes = [...batchData.times];
                              newTimes[index].start_time = e.target.value;
                              setBatchData({...batchData, times: newTimes});
                            }}
                          />
                          <span>-</span>
                          <input
                            type="time"
                            className="input-small"
                            value={time.end_time}
                            onChange={e => {
                              const newTimes = [...batchData.times];
                              newTimes[index].end_time = e.target.value;
                              setBatchData({...batchData, times: newTimes});
                            }}
                          />
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => {
                              const newTimes = batchData.times.filter((_, i) => i !== index);
                              setBatchData({...batchData, times: newTimes});
                            }}
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary btn-small"
                      onClick={() => {
                        setBatchData({
                          ...batchData,
                          times: [...batchData.times, { start_time: '09:00', end_time: '10:00' }]
                        });
                      }}
                    >
                      + Adicionar Horário
                    </button>
                  </div>

                  <div className="modal-actions">
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Criar Horários em Lote
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default TimeSlots;