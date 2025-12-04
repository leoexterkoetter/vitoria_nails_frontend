import './Home.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">

      {/* Banner principal */}
      <div className="home-banner">
        <h2>Unhas de alto nível ✨</h2>
        <p>Agende seu horário com a Vitoria Nail Designer</p>
      </div>

      {/* Ações principais estilo app */}
      <div className="quick-actions">
        <button onClick={() => navigate('/agendar')} className="quick-btn">
          📅 Agendar horário
        </button>

        <button onClick={() => navigate('/meus-agendamentos')} className="quick-btn">
          📝 Meus agendamentos
        </button>
      </div>

      {/* Título dos serviços */}
      <h3 className="section-title">Serviços disponíveis</h3>

      {/* Cards premium */}
      <div className="services-list">

        <div className="service-card">
          <h4>Manicure Tradicional</h4>
          <p>Ideal para quem quer unhas lindas e bem cuidadas.</p>
          <button className="service-btn">Agendar</button>
        </div>

        <div className="service-card">
          <h4>Alongamento em Gel</h4>
          <p>Unhas mais longas, resistentes e naturais.</p>
          <button className="service-btn">Agendar</button>
        </div>

        <div className="service-card">
          <h4>Blindagem</h4>
          <p>Proteção extra, brilho e durabilidade máxima.</p>
          <button className="service-btn">Agendar</button>
        </div>

      </div>
    </div>
  );
}
