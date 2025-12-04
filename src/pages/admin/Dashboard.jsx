import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarCheck, Scissors, Users, LogOut } from "lucide-react";
import "./Dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalAppointments: 0,
    pending: 0,
    services: 0,
    clients: 0
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Você deve substituir pelas suas rotas reais
      setData({
        totalAppointments: 42,
        pending: 5,
        services: 9,
        clients: 120
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header fade-in">
        <h1>Painel da Vitoria</h1>
        <p>Gerencie horários, serviços e clientes</p>
      </div>

      {/* CARDS RESUMO */}
      <div className="admin-cards">
        
        <div className="admin-card pop">
          <CalendarCheck size={26} />
          <div>
            <h3>{data.totalAppointments}</h3>
            <p>Agendamentos</p>
          </div>
        </div>

        <div className="admin-card pop">
          <CalendarCheck size={26} />
          <div>
            <h3>{data.pending}</h3>
            <p>Pendentes</p>
          </div>
        </div>

        <div className="admin-card pop">
          <Scissors size={26} />
          <div>
            <h3>{data.services}</h3>
            <p>Serviços</p>
          </div>
        </div>

        <div className="admin-card pop">
          <Users size={26} />
          <div>
            <h3>{data.clients}</h3>
            <p>Clientes</p>
          </div>
        </div>

      </div>

      {/* MENU DE AÇÕES */}
      <div className="admin-actions slide-up">

        <button className="admin-btn" onClick={() => navigate("/admin/appointments")}>
          <CalendarCheck size={22} />
          Gerenciar Agendamentos
        </button>

        <button className="admin-btn" onClick={() => navigate("/admin/services")}>
          <Scissors size={22} />
          Gerenciar Serviços
        </button>

        <button className="admin-btn" onClick={() => navigate("/admin/clients")}>
          <Users size={22} />
          Clientes
        </button>

        <button
          className="admin-btn danger"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          <LogOut size={22} />
          Sair
        </button>

      </div>

      {/* MENU INFERIOR MOBILE */}
      <nav className="bottom-nav">
        <button onClick={() => navigate("/admin/dashboard")}>
          <CalendarCheck size={22} />
          <span>Dashboard</span>
        </button>

        <button onClick={() => navigate("/admin/services")}>
          <Scissors size={22} />
          <span>Serviços</span>
        </button>

        <button onClick={() => navigate("/admin/appointments")}>
          <CalendarCheck size={22} />
          <span>Agenda</span>
        </button>

        <button onClick={() => navigate("/admin/profile")}>
          <Users size={22} />
          <span>Perfil</span>
        </button>
      </nav>

    </div>
  );
}
