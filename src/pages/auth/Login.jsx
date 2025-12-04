import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);

      if (response.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.error || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container page-fade">
      <div className="auth-card premium-card">
        <div className="auth-header fade-in-up">
          <h1 className="logo-title">✨ Vitoria Nail Designer</h1>
          <p className="subtitle">Entre para agendar seu horário</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form fade-in-up delay-1">
          {error && <div className="error-alert">{error}</div>}

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input focus-animate"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input focus-animate"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-glow hover-lift"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-footer fade-in-up delay-2">
          <p>
            Não tem conta?{' '}
            <Link to="/register" className="auth-link underline-animate">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
