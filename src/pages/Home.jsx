import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Home as HomeIcon,
  User,
  LogOut,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import authService from '../services/authService';
import './Home.css';

export default function Home() {
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
    <div className="home-premium page-fade">
      
      {/* ===== NAVBAR PREMIUM ===== */}
      <nav className="navbar-premium">
        <h2 className="brand-premium">💅 Vitoria Nail Designer</h2>

        <div className="nav-actions">
          <button className="nav-icon active" onClick={() => navigate('/home')}>
            <HomeIcon size={20} />
            <span>Início</span>
          </button>

          <button className="nav-icon" onClick={() => navigate('/services')}>
            <Calendar size={20} />
            <span>Serviços</span>
          </button>

          <button className="nav-icon" onClick={() => navigate('/my-appointments')}>
            <Clock size={20} />
            <span>Agendamentos</span>
          </button>

          <button className="nav-icon" onClick={() => navigate('/profile')}>
            <User size={20} />
            <span>Perfil</span>
          </button>

          <button className="nav-icon logout" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </nav>


      {/* ===== HERO PREMIUM ===== */}
      <section className="hero-premium fade-in-up">
        <div className="hero-text">
          <h1 className="hero-title">
            Olá, {userName}! <span className="wave">👋</span>
          </h1>

          <p className="hero-subtitle">
            Bem-vinda ao seu espaço de beleza. Agende, escolha serviços e acompanhe suas sessões.
          </p>

          <button className="hero-button hover-lift btn-glow" onClick={() => navigate('/booking')}>
            <Sparkles size={20} />
            Agendar Agora
          </button>
        </div>

        <div className="hero-art fade-in-up delay-1">
          <div className="floating-emoji">💅✨</div>
        </div>
      </section>


      {/* ===== COMO FUNCIONA ===== */}
      <section className="how-section fade-in-up delay-1">
        <h2 className="section-title">Como Funciona</h2>

        <div className="steps-premium">
          <div className="step-card hover-lift">
            <div className="step-icon">📅</div>
            <h3>Escolha o Serviço</h3>
            <p>Navegue e selecione o serviço ideal para você</p>
          </div>

          <div className="step-card hover-lift">
            <div className="step-icon">⏰</div>
            <h3>Data e Horário</h3>
            <p>Escolha o melhor horário disponível</p>
          </div>

          <div className="step-card hover-lift">
            <div className="step-icon">✅</div>
            <h3>Confirmação</h3>
            <p>Finalize seu agendamento rapidamente</p>
          </div>
        </div>
      </section>


      {/* ===== SERVIÇOS POPULARES ===== */}
      <section className="services-section fade-in-up delay-2">
        <div className="section-header">
          <h2>Serviços Populares</h2>

          <button className="view-all hover-lift" onClick={() => navigate('/services')}>
            Ver Todos <ArrowRight size={18} />
          </button>
        </div>

        <div className="services-grid">
          {popularServices.map(service => (
            <div key={service.id} className="service-card hover-lift">
              <div className="service-emoji">{service.image}</div>

              <h3>{service.name}</h3>
              <p className="service-desc">{service.description}</p>

              <div className="service-info">
                <span className="price">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(service.price)}
                </span>

                <span className="duration">
                  <Clock size={14} />
                  {service.duration} min
                </span>
              </div>

              <button
                className="service-btn hover-lift btn-glow"
                onClick={() =>
                  navigate('/booking', { state: { selectedService: service } })
                }
              >
                Agendar
              </button>
            </div>
          ))}
        </div>
      </section>


      {/* ===== CTA FINAL ===== */}
      <section className="cta-premium fade-in-up delay-3">
        <h2>Pronta para transformar suas unhas?</h2>
        <p>Agende agora mesmo e garanta o melhor atendimento!</p>

        <button className="cta-button hover-lift btn-glow" onClick={() => navigate('/booking')}>
          <Calendar size={20} />
          Fazer Agendamento
        </button>
      </section>
    </div>
  );
}
