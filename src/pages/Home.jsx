import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Heart, Sparkles } from 'lucide-react';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(user.name || 'Cliente');
  }, []);

  return (
    <div className="home-page">
      <header className="hero">
        <div className="hero-content">
          <h1>Bem-vinda, {userName}! 💅</h1>
          <p>Transforme suas unhas em obras de arte</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/services')}
          >
            Ver Serviços
          </button>
        </div>
      </header>

      <section className="how-it-works">
        <h2>Como Funciona</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <Sparkles size={32} />
            </div>
            <h3>1. Escolha o Serviço</h3>
            <p>Navegue pelos nossos serviços e escolha o que mais combina com você</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <Calendar size={32} />
            </div>
            <h3>2. Selecione o Horário</h3>
            <p>Escolha o dia e horário que melhor se encaixa na sua agenda</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <Clock size={32} />
            </div>
            <h3>3. Confirme e Pronto!</h3>
            <p>Receba a confirmação e compareça no horário marcado</p>
          </div>
        </div>
      </section>

      <section className="featured-services">
        <h2>Serviços Populares</h2>
        <div className="services-grid">
          <div className="service-card" onClick={() => navigate('/services')}>
            <div className="service-icon">💅</div>
            <h3>Alongamento em Gel</h3>
            <p>R$ 120,00</p>
          </div>

          <div className="service-card" onClick={() => navigate('/services')}>
            <div className="service-icon">✨</div>
            <h3>Esmaltação em Gel</h3>
            <p>R$ 60,00</p>
          </div>

          <div className="service-card" onClick={() => navigate('/services')}>
            <div className="service-icon">🎨</div>
            <h3>Nail Art</h3>
            <p>R$ 40,00</p>
          </div>

          <div className="service-card" onClick={() => navigate('/services')}>
            <div className="service-icon">🦶</div>
            <h3>Spa dos Pés</h3>
            <p>R$ 90,00</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <Heart size={48} className="cta-icon" />
          <h2>Pronta para suas unhas perfeitas?</h2>
          <p>Agende agora e garanta seu horário!</p>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => navigate('/booking')}
          >
            Agendar Agora
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;