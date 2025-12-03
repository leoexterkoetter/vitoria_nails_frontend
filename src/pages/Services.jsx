import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import api from '../services/api';
import './Services.css';

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = {
    all: 'Todos',
    alongamento: 'Alongamento',
    manutencao: 'Manutenção',
    esmaltacao: 'Esmaltação',
    spa: 'Spa'
  };

 const filteredServices = Array.isArray(services) 
  ? (filter === 'all' ? services : services.filter(s => s.category === filter))
  : [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando serviços...</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>Nossos Serviços</h1>
        <p>Escolha o serviço perfeito para você</p>
      </div>

      <div className="filters">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="services-container">
        {filteredServices.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum serviço encontrado</p>
          </div>
        ) : (
          <div className="services-list">
            {filteredServices.map(service => (
              <div key={service._id} className="service-item">
                <div className="service-info">
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-details">
                    <div className="detail">
                      <Clock size={16} />
                      <span>{service.duration} min</span>
                    </div>
                    <div className="detail price">
                      {formatPrice(service.price)}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/booking', { 
                    state: { selectedService: service } 
                  })}
                >
                  Agendar
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;