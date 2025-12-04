import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Home as HomeIcon, User, LogOut, Sparkles, ArrowRight } from 'lucide-react';
import authService from '../services/authService';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    setUserName(name || 'Cliente');
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const popularServices = [
    {
      id: 1,
      name: 'Alongamento em Gel',
      price: 120,
      duration: 120,
      image: '💅',
      description: 'Unhas perfeitas e duradouras'
    },
    {
      id: 2,
      name: 'Esmaltação em Gel',
      price: 60,
      duration: 60,
      image: '✨',
      description: 'Cor vibrante por mais tempo'
    },
    {
      id: 3,
      name: 'Nail Art',
      price: 40,
      duration: 45,
      image: '🎨',
      description: 'Designs exclusivos e criativos'
    },
    {
      id: 4,
      name: 'Spa para Pés',
      price: 90,
      duration: 90,
      image: '🦶',
      description: 'Relaxamento e cuidado completo'
    }
  ];

  return (
    <div className="user-dashboard">
      <nav className="user-nav">
        <div className="nav-brand">
          <h2>💅 Vitoria Nail Designer</h2>
        </div>
        <div className="nav-links">
          <button className="nav-link active" onClick={() => navigate('/home')}>
            <HomeIcon size={20} />
            Início
          </button>
          <button className="nav-link" onClick={() => navigate('/services')}>
            <Calendar size={20} />
            Serviços
          </button>
          <button className="nav-link" onClick={() => navigate('/my-appointments')}>
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

      <div className="home-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Olá, {userName}! 👋</h1>
              <p className="hero-subtitle">
                Bem-vinda ao seu espaço de beleza e cuidado. Aqui você encontra os melhores serviços de nail design.
              </p>
              <button className="hero-btn" onClick={() => navigate('/booking')}>
                <Sparkles size={20} />
                Agendar Agora
              </button>
            </div>
            <div className="hero-image">
              <div className="hero-decoration">💅✨</div>
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="how-it-works">
          <h2>Como Funciona</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon">📅</div>
              <h3>Escolha o Serviço</h3>
              <p>Navegue pelos nossos serviços e escolha o que melhor se adapta a você</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon">⏰</div>
              <h3>Selecione Data e Horário</h3>
              <p>Escolha o dia e horário que funciona melhor para sua agenda</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon">✅</div>
              <h3>Confirme seu Agendamento</h3>
              <p>Finalize e aguarde a confirmação. É rápido e fácil!</p>
            </div>
          </div>
        </section>

        {/* Serviços Populares */}
        <section className="popular-services">
          <div className="section-header">
            <h2>Serviços Populares</h2>
            <button className="view-all-btn" onClick={() => navigate('/services')}>
              Ver Todos
              <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="services-grid">
            {popularServices.map(service => (
              <div key={service.id} className="service-card-home">
                <div className="service-emoji">{service.image}</div>
                <h3>{service.name}</h3>
                <p className="service-desc">{service.description}</p>
                <div className="service-footer">
                  <div className="service-details">
                    <span className="service-price">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                    </span>
                    <span className="service-duration">
                      <Clock size={14} />
                      {service.duration} min
                    </span>
                  </div>
                  <button 
                    className="btn-book-service"
                    onClick={() => navigate('/booking', { state: { selectedService: service } })}
                  >
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Pronta para transformar suas unhas?</h2>
            <p>Agende seu horário agora e garanta unhas perfeitas!</p>
            <button className="cta-btn" onClick={() => navigate('/booking')}>
              <Calendar size={20} />
              Fazer Agendamento
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;