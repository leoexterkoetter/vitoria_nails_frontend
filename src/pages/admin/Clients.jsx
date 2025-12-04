import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, TrendingUp, LogOut, Mail, Phone } from 'lucide-react';
import api from '../../services/api';
import authService from '../../services/authService';
import './Dashboard.css';

function Clients() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/admin/clients');
      setClients(response.data.clients);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
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
          <button className="nav-item" onClick={() => navigate('/admin/services')}>
            <Clock size={20} />
            Serviços
          </button>
          <button className="nav-item" onClick={() => navigate('/admin/time-slots')}>
  <Clock size={20} />
  Horários
</button>
          <button className="nav-item active" onClick={() => navigate('/admin/clients')}>
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
          <h1>Clientes</h1>
        </header>

        <div className="table-card">
          {loading ? (
            <div className="loading-container"><div className="spinner"></div></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Telefone</th>
                  <th>Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client._id}>
                    <td>
                      <div className="table-name">{client.name}</div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <Mail size={16} />
                        {client.email}
                      </div>
                    </td>
                    <td>
                      {client.phone ? (
                        <div className="contact-info">
                          <Phone size={16} />
                          {client.phone}
                        </div>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>{new Date(client.createdAt).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Clients;