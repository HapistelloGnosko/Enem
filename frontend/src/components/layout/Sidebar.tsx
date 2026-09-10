import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Compass,
  BarChart3,
  Trophy,
  Award,
  Layers,
  User,
  LogOut,
  Flame,
  Zap,
  BookX,
  RotateCcw,
  BrainCircuit,
  Library,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { XPBar } from '../ui/XPBar';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/questions', label: 'Questões', icon: BookOpen },
  { to: '/library', label: 'Biblioteca ENEM', icon: Library },
  { to: '/daily', label: 'Questão do Dia', icon: CalendarCheck, badge: 'HOJE' },
  { to: '/areas', label: 'Áreas & Atributos', icon: Compass },
  { to: '/performance', label: 'Desempenho', icon: BarChart3 },
  { to: '/codex', label: 'Codex dos Erros', icon: BookX },
  { to: '/reviews', label: 'Revisão', icon: RotateCcw },
  { to: '/coach', label: 'Coach IA', icon: BrainCircuit },
  { to: '/missions', label: 'Missões', icon: Award, badge: 'EM BREVE' },
  { to: '/simulados', label: 'Simulados', icon: Layers, badge: 'EM BREVE' },
  { to: '/achievements', label: 'Conquistas', icon: Trophy },
  { to: '/profile', label: 'Perfil', icon: User },
];

export function Sidebar() {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-bg-secondary border-r border-white/5 flex flex-col justify-between shrink-0 p-4">
      <div className="flex flex-col gap-6">
        {/* Logo Persona/RPG */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-neon-accent text-white font-black text-lg">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <div className="font-mono font-black text-sm tracking-widest text-text-primary">
              ENEM<span className="text-accent">QUEST</span>
            </div>
            <div className="text-[10px] text-text-muted font-mono tracking-wider">
              SISTEMA TÁTICO
            </div>
          </div>
        </div>

        {/* Card do Usuário + Barra de XP */}
        {user && (
          <div className="p-3.5 rounded-xl bg-bg-tertiary border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-text-primary truncate">{user.name}</span>
                    {user.prestige && user.prestige > 0 ? (
                      <span className="text-[9px] px-1 rounded bg-purple-500/20 text-purple-300 font-mono font-bold" title={`Prestígio ${user.prestige}`}>
                        P{['I', 'II', 'III', 'IV', 'V'][user.prestige - 1]}
                      </span>
                    ) : null}
                  </div>
                  <div className="text-[10px] text-accent font-mono truncate">{user.title || 'Novato'}</div>
                </div>
              </div>

              {user.streak > 0 && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-mono shrink-0" title="Sequência de dias">
                  <Flame size={12} fill="currentColor" />
                  <span>{user.streak}</span>
                </div>
              )}
            </div>

            <XPBar
              level={user.level}
              currentXp={user.currentXp}
              nextLevelXp={user.nextLevelXp}
              progress={user.progress}
              compact
            />

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-white/5 pt-1.5">
              <span className="text-text-muted">POWER SCORE</span>
              <span className="text-accent font-semibold">{user.powerScore || 300} · {user.activeLeague || 'Bronze'}</span>
            </div>
          </div>
        )}

        {/* Menu de Navegação */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-accent/15 text-accent-bright border border-accent/30 font-semibold shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-text-muted font-mono tracking-tighter">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Rodapé / Logout */}
      <div className="pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-text-muted hover:text-error hover:bg-error/10 transition-colors"
        >
          <LogOut size={16} />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  );
}
