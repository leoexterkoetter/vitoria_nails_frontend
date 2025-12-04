import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, LogOut, Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'alongamento',
    image_url: '',
    active: true
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/admin/services');
      setServices(response.data.services);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/admin/services/${editingService._id}`, formData);
      } else {
        await api.post('/admin/services', formData);
      }
      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      alert('Erro ao salvar serviço');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este serviço?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (error) {
      alert('Erro ao deletar serviço');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      category: service.category,
      image_url: service.image_url || '',
      active: service.active
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: 'alongamento',
      image_url: '',
      active: true
    });
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
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
          <button className="nav-item" onClick={() => navigate('/admin/appointments')}>
            <Calendar size={20} />
            Agendamentos
          </button>
          <button className="nav-item active" onClick={() => navigate('/admin/services')}>
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
          <h1>Gerenciar Serviços</h1>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            Novo Serviço
          </button>
        </header>

        <div className="services-grid-admin">
          {services.map(service => (
            <div key={service._id} className="service-card-admin">
              <div className="service-card-header">
                <h3>{service.name}</h3>
                <span className={`badge ${service.active ? 'badge-success' : 'badge-danger'}`}>
                  {service.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <p className="service-description">{service.description}</p>
              <div className="service-meta">
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{service.duration} min</span>
                </div>
                <div className="meta-item">
                  <span className="price">{formatPrice(service.price)}</span>
                </div>
              </div>
              <div className="service-actions">
                <button className="btn-icon btn-edit" onClick={() => handleEdit(service)}>
                  <Edit2 size={16} />
                  Editar
                </button>
                <button className="btn-icon btn-delete" onClick={() => handleDelete(service._id)}>
                  <Trash2 size={16} />
                  Deletar
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingService ? 'Editar Serviço' : 'Novo Serviço'}</h2>
                <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    className="input"
                    rows="3"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preço (R$) *</label>
                    <input
                      type="number"
                      className="input"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Duração (min) *</label>
                    <input
                      type="number"
                      className="input"
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Categoria *</label>
                  <select
                    className="input"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="alongamento">Alongamento</option>
                    <option value="manutencao">Manutenção</option>
                    <option value="esmaltacao">Esmaltação</option>
                    <option value="spa">Spa</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>URL da Imagem</label>
                  <input
                    type="url"
                    className="input"
                    value={formData.image_url}
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={e => setFormData({...formData, active: e.target.checked})}
                    />
                    <span>Serviço ativo</span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Salvar Alterações' : 'Criar Serviço'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Services;