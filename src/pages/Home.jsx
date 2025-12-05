// src/pages/Home.jsx
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Cliente';

  const services = [
    { name: 'Alongamento Molde F1', description: 'Ideal para quem quer unhas lindas e bem cuidadas.' },
    { name: 'Banho em Gel', description: 'Proteção extra para unhas fortes e naturais.' },
    { name: 'Blindagem', description: 'Resistência, brilho e acabamento impecável.' }
  ];

  return (
    <div className="home-wrapper">

      {/* =======================
          Header
      ======================= */}
      <div className="home-header">
        <h2>Olá, {userName}! 💅🏻</h2>
        <p>
          Bem vinda ao seu espaço de beleza e cuidado.  
          Aqui você encontra os melhores serviços de nail design. ✨
        </p>

        <div className="top-buttons">
          <button className="top-btn" onClick={() => navigate('/booking')}>
            ✨ Agendar Agora
          </button>

          <button className="top-btn" onClick={() => navigate('/my-appointments')}>
            📅 Meus Agendamentos
          </button>
        </div>
      </div>

      {/* =======================
          Serviços
      ======================= */}
      <h3 className="section-title">Serviços mais pedidos ✨</h3>

      <div className="services-list">
        {services.map((s, i) => (
          <div key={i} className="service-card">
            <h4>{s.name}</h4>
            <p>{s.description}</p>
            <button
              className="service-btn"
              onClick={() => navigate('/booking')}
            >
              Agendar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
