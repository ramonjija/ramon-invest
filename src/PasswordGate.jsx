import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO
// Defina a variável de ambiente no Vercel:
//   Nome:  VITE_SITE_PASSWORD
//   Valor: (sua senha)
//
// Em desenvolvimento local, crie um arquivo .env na raiz:
//   VITE_SITE_PASSWORD=suasenha
//
// IMPORTANTE: adicione .env ao .gitignore para não subir a senha.
// ─────────────────────────────────────────────────────────────────

const STORAGE_KEY = "ramon_invest_auth";
const SITE_PASSWORD = import.meta.env.VITE_SITE_PASSWORD;

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [checking, setChecking] = useState(true);

  // Verifica se já autenticou anteriormente (sessão salva)
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === SITE_PASSWORD) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    if (!SITE_PASSWORD) {
      // Sem variável de ambiente configurada: bloqueia com aviso
      setError(true);
      return;
    }

    if (input === SITE_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, SITE_PASSWORD);
      setAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setInput("");
      setTimeout(() => setShake(false), 600);
    }
  }

  // Evita flash de conteúdo enquanto verifica sessão
  if (checking) return null;

  // Já autenticado: renderiza o app normalmente
  if (authenticated) return children;

  // Tela de login
  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <div style={styles.lock}>🔒</div>
        <h1 style={styles.title}>Área Restrita</h1>
        <p style={styles.subtitle}>Carteira de Investimentos — Ramon</p>

        {!SITE_PASSWORD && (
          <div style={styles.configWarning}>
            ⚠️ Variável <code>VITE_SITE_PASSWORD</code> não configurada no Vercel.
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false); }}
            placeholder="Digite a senha"
            autoFocus
            autoComplete="current-password"
            style={{
              ...styles.input,
              ...(error ? styles.inputError : {}),
              ...(shake ? styles.shake : {}),
            }}
          />

          {error && (
            <p style={styles.errorMsg}>
              {!SITE_PASSWORD
                ? "Servidor mal configurado. Configure VITE_SITE_PASSWORD no Vercel."
                : "Senha incorreta. Tente novamente."}
            </p>
          )}

          <button type="submit" style={styles.button}>
            Entrar
          </button>
        </form>

        <p style={styles.footer}>Acesso privado · Ramon Invest</p>
      </div>

      <style>{`
        @keyframes shakeAnim {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// ─── ESTILOS ─────────────────────────────────────────────────────
const styles = {
  overlay: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#07090c",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#0f1318",
    border: "1px solid #1c2430",
    padding: "2.5rem 2rem",
    width: "100%",
    maxWidth: "360px",
    textAlign: "center",
  },
  lock: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },
  title: {
    color: "#e2e8f0",
    fontSize: "1.1rem",
    fontWeight: 600,
    margin: "0 0 0.4rem",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "0.8rem",
    margin: "0 0 1.8rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  input: {
    width: "100%",
    padding: "0.7rem 1rem",
    background: "#0d1117",
    border: "1px solid #1c2430",
    color: "#e2e8f0",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputError: {
    border: "1px solid #ef4444",
  },
  shake: {
    animation: "shakeAnim 0.6s ease",
  },
  errorMsg: {
    color: "#ef4444",
    fontSize: "0.72rem",
    margin: "0",
    textAlign: "left",
  },
  button: {
    width: "100%",
    padding: "0.7rem",
    background: "#22d3ee",
    color: "#07090c",
    border: "none",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.3rem",
    transition: "opacity 0.2s",
  },
  configWarning: {
    background: "#1c1000",
    border: "1px solid #854d0e",
    color: "#fbbf24",
    fontSize: "0.7rem",
    padding: "0.6rem 0.8rem",
    marginBottom: "1rem",
    textAlign: "left",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "1.5rem",
    color: "#374151",
    fontSize: "0.65rem",
  },
};
