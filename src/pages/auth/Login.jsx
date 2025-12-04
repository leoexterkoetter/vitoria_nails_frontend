import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: senha })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Erro no login");
      } else {
        localStorage.setItem("token", data.token);
        navigate("/home");
      }

    } catch (err) {
      alert("Erro ao conectar com o servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">

      {/* Cabeçalho com animação */}
      <div className="login-header">
        <h1>Bem-vinda ✨</h1>
        <p>Acesse sua conta para continuar</p>
      </div>

      {/* Card */}
      <div className="login-card">

        <input 
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password"
          placeholder="Sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

      </div>

      {/* Rodapé */}
      <p className="login-footer">
        Não tem conta? <span onClick={() => navigate("/register")}>Criar agora</span>
      </p>
    </div>
  );
}
