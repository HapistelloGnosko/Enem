import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ShieldCheck, ArrowRight, UserPlus, LogIn } from 'lucide-react';
import { api } from '../services/api';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('estudante@enem.com');
  const [password, setPassword] = useState('enem123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = isRegister
        ? await api.register(name, email, password)
        : await api.login(email, password);

      setAuth(res.user, res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent text-white shadow-neon-accent mb-4">
            <Zap size={28} fill="currentColor" />
          </div>
          <h1 className="font-mono text-2xl font-black tracking-wider text-text-primary">
            ENEM<span className="text-accent">QUEST</span>
          </h1>
          <p className="text-xs text-text-muted font-mono uppercase tracking-widest mt-1">
            Sistema de Treinamento Tático
          </p>
        </div>

        {/* Card de Formulário */}
        <div className="quest-card border-white/10">
          <div className="flex rounded-xl bg-bg-secondary p-1 mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                !isRegister ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <LogIn size={14} /> Entrar
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                isRegister ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <UserPlus size={14} /> Novo Perfil
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-text-muted tracking-wider mb-1.5">
                  Seu Nome
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Silva"
                  className="quest-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-muted tracking-wider mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                className="quest-input font-mono text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-text-muted tracking-wider mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="quest-input font-mono text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-error text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="quest-btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                'Autenticando...'
              ) : (
                <>
                  <span>{isRegister ? 'Criar Perfil' : 'Iniciar Treinamento'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Dica de usuário padrão */}
          {!isRegister && (
            <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-success" /> Perfil pré-configurado:
              </span>
              <span className="font-mono text-[11px] bg-white/5 px-2 py-0.5 rounded text-text-secondary">
                estudante@enem.com / enem123
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
