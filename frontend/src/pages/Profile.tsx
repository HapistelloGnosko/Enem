import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { api, Stats, Title, PowerScoreData } from '../services/api';
import { XPBar } from '../components/ui/XPBar';
import {
  User,
  Flame,
  Trophy,
  Target,
  BookOpen,
  Calendar,
  Shield,
  Award,
  Crown,
  Sparkles,
  CheckCircle2,
  Lock,
  RotateCcw,
  Zap,
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'avatar-1', label: 'Vanguard', bg: 'bg-accent/20 border-accent/50 text-accent', symbol: 'V' },
  { id: 'avatar-2', label: 'Phantom', bg: 'bg-neon-blue/20 border-neon-blue/50 text-neon-blue', symbol: 'P' },
  { id: 'avatar-3', label: 'Cipher', bg: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400', symbol: 'C' },
  { id: 'avatar-4', label: 'Nova', bg: 'bg-amber-500/20 border-amber-500/50 text-amber-400', symbol: 'N' },
  { id: 'avatar-5', label: 'Oracle', bg: 'bg-purple-500/20 border-purple-500/50 text-purple-400', symbol: 'O' },
  { id: 'avatar-6', label: 'Titan', bg: 'bg-rose-500/20 border-rose-500/50 text-rose-400', symbol: 'T' },
];

export default function Profile() {
  const { user, updateUser } = useAppStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [titles, setTitles] = useState<Title[]>([]);
  const [powerScore, setPowerScore] = useState<PowerScoreData | null>(null);
  const [equipping, setEquipping] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [claimingReturn, setClaimingReturn] = useState(false);
  const [prestiging, setPrestiging] = useState(false);

  const loadData = async () => {
    try {
      const [u, s, t, ps] = await Promise.all([
        api.me(),
        api.stats(),
        api.getTitles(),
        api.getPowerScore(),
      ]);
      updateUser(u);
      setStats(s);
      setTitles(t);
      setPowerScore(ps);
    } catch (err) {
      console.error('Erro ao carregar dados do perfil:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user) return null;

  const handleSelectAvatar = async (avatarId: string) => {
    try {
      await api.updateAvatar(avatarId);
      updateUser({ avatar: avatarId });
      setActionMessage('Avatar atualizado com sucesso.');
      setTimeout(() => setActionMessage(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEquipTitle = async (titleId: number) => {
    setEquipping(true);
    try {
      const res = await api.equipTitle(titleId);
      if (res.success) {
        updateUser({ title: res.equippedTitle });
        setActionMessage(`Título "${res.equippedTitle}" equipado!`);
        setTimeout(() => setActionMessage(''), 3000);
        await loadData();
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Erro ao equipar título.');
    } finally {
      setEquipping(false);
    }
  };

  const handleClaimReturn = async () => {
    setClaimingReturn(true);
    try {
      const res = await api.claimReturnMission();
      setActionMessage(res.message);
      setTimeout(() => setActionMessage(''), 4000);
      await loadData();
    } catch (err: any) {
      setActionMessage(err.message || 'Erro ao resgatar missão.');
    } finally {
      setClaimingReturn(false);
    }
  };

  const handlePrestige = async () => {
    if (!window.confirm('Deseja iniciar a Ascensão de Prestígio? Seu nível e XP serão reiniciados para 1, mantendo todas as conquistas, títulos, estatísticas e adicionando um novo selo de Prestígio.')) {
      return;
    }
    setPrestiging(true);
    try {
      const res = await api.prestige();
      setActionMessage(res.message);
      await loadData();
    } catch (err: any) {
      setActionMessage(err.message || 'Erro ao realizar prestígio.');
    } finally {
      setPrestiging(false);
    }
  };

  const activeAvatar = AVATAR_OPTIONS.find((a) => a.id === user.avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-accent tracking-widest">
          <User size={14} /> Ficha do Estudante RPG
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mt-1">
          Perfil Acadêmico Tático
        </h1>
        <p className="text-xs md:text-sm text-text-muted mt-0.5">
          Progressão, títulos equipados, ENEM Power Score e medalhas de honra.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent-bright text-xs flex items-center gap-2 font-mono animate-fadeIn">
          <CheckCircle2 size={14} /> {actionMessage}
        </div>
      )}

      {/* Banner de Missão de Retorno (se ativa) */}
      {user.returnMission?.active && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-xs font-bold text-amber-300 uppercase">
                  RETORNO AO TREINO ({user.returnMission.daysAway} dias longe)
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-md font-semibold">
                  +150 XP de acolhimento
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Conclua as tarefas de reintrodução para reativar seu ritmo de estudo sem punição:
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] font-mono text-text-muted">
                <span>Fáceis: {user.returnMission.easyProgress}/3</span>
                <span>Médias: {user.returnMission.mediumProgress}/2</span>
                <span>Revisão: {user.returnMission.reviewProgress}/1</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleClaimReturn}
            disabled={!user.returnMission.completed || claimingReturn}
            className={`quest-btn-primary text-xs shrink-0 self-start md:self-center ${
              !user.returnMission.completed ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {user.returnMission.completed ? 'Resgatar +150 XP' : 'Em Andamento'}
          </button>
        </div>
      )}

      {/* Card Principal do Estudante */}
      <div className="quest-card flex flex-col md:flex-row md:items-center justify-between gap-6 p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-2xl font-black shadow-neon-accent ${activeAvatar.bg}`}
          >
            {activeAvatar.symbol}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
              {user.prestige && user.prestige > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono font-bold">
                  PRESTÍGIO {['I', 'II', 'III', 'IV', 'V'][user.prestige - 1]}
                </span>
              ) : null}
            </div>
            <div className="text-xs text-accent font-mono font-semibold flex items-center gap-1.5 mt-0.5">
              <Award size={13} /> {user.title || 'Novato'}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-text-muted mt-1 font-mono">
              <Calendar size={12} /> Membro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-center min-w-24">
            <div className="text-xs text-text-muted font-mono uppercase">NÍVEL</div>
            <div className="text-2xl font-mono font-black text-accent">{user.level}</div>
          </div>

          <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-center min-w-24">
            <div className="text-xs text-text-muted font-mono uppercase">SEQUÊNCIA</div>
            <div className="text-2xl font-mono font-black text-amber-400 flex items-center justify-center gap-1">
              <Flame size={18} fill="currentColor" /> {user.streak}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 text-center min-w-28">
            <div className="text-xs text-text-muted font-mono uppercase">LIGA</div>
            <div className="text-sm font-mono font-black text-neon-blue mt-1">
              {powerScore?.league || user.activeLeague || 'Bronze'}
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Avatar Tático */}
      <div className="quest-card p-5 flex flex-col gap-3">
        <span className="text-xs font-mono uppercase text-text-muted tracking-wider">
          PERSONALIZAR AVATAR TÁTICO
        </span>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {AVATAR_OPTIONS.map((av) => (
            <button
              key={av.id}
              onClick={() => handleSelectAvatar(av.id)}
              className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                user.avatar === av.id
                  ? 'border-accent bg-accent/15 shadow-sm scale-105'
                  : 'border-white/5 bg-bg-secondary hover:border-white/20'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border ${av.bg}`}
              >
                {av.symbol}
              </div>
              <span className="text-[10px] font-mono text-text-secondary">{av.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ENEM Power Score vs XP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Power Score */}
        <div className="quest-card p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-neon-blue" />
              <span className="text-xs font-mono uppercase text-text-primary font-bold">
                ENEM POWER SCORE
              </span>
            </div>
            <span className="text-xs font-mono text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/30 font-bold">
              {powerScore?.league}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-black text-text-primary">
              {powerScore?.score || user.powerScore || 300}
            </span>
            <span className="text-xs text-text-muted font-mono">/ 1000 pts</span>
          </div>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Indicador de força acadêmica calculada a partir de sua precisão, dificuldade média das questões, domínio entre as 4 grandes áreas e consistência.
          </p>

          {powerScore?.breakdown && (
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-white/5 pt-3">
              <div>
                <span className="text-text-muted">Acurácia:</span>{' '}
                <span className="text-text-primary font-bold">{powerScore.breakdown.accuracyPart}/350</span>
              </div>
              <div>
                <span className="text-text-muted">Dificuldade:</span>{' '}
                <span className="text-text-primary font-bold">{powerScore.breakdown.difficultyPart}/200</span>
              </div>
              <div>
                <span className="text-text-muted">Domínio Áreas:</span>{' '}
                <span className="text-text-primary font-bold">{powerScore.breakdown.masteryPart}/250</span>
              </div>
              <div>
                <span className="text-text-muted">Consistência:</span>{' '}
                <span className="text-text-primary font-bold">{powerScore.breakdown.consistencyPart}/200</span>
              </div>
            </div>
          )}
        </div>

        {/* Progressão de XP e Prestígio */}
        <div className="quest-card p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Crown size={16} className="text-accent" />
                <span className="text-xs font-mono uppercase text-text-primary font-bold">
                  PROGRESSÃO DE NÍVEL & PRESTÍGIO
                </span>
              </div>
              <span className="text-xs font-mono text-accent font-bold">
                Nível {user.level}
              </span>
            </div>
            <XPBar
              level={user.level}
              currentXp={user.currentXp}
              nextLevelXp={user.nextLevelXp}
              progress={user.progress}
            />
          </div>

          <div className="p-3 rounded-xl bg-bg-secondary border border-white/5 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles size={12} className="text-purple-400" />
                Prestígio Atual: {user.prestige && user.prestige > 0 ? `Grau ${user.prestige}` : 'Inativo'}
              </div>
              <div className="text-[10px] text-text-muted font-mono mt-0.5">
                {user.level >= 50
                  ? 'Pronto para Ascensão de Prestígio!'
                  : `Disponível a partir do Nível 50 (atualmente ${user.level}/50)`}
              </div>
            </div>

            <button
              onClick={handlePrestige}
              disabled={user.level < 50 || prestiging}
              className={`quest-btn-secondary text-xs shrink-0 ${
                user.level < 50 ? 'opacity-40 cursor-not-allowed' : ''
              }`}
            >
              Ascender Prestígio
            </button>
          </div>
        </div>
      </div>

      {/* Painel de Títulos Desbloqueáveis */}
      <div className="quest-card p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-mono font-bold text-text-primary uppercase flex items-center gap-2">
              <Award size={16} className="text-accent" /> TÍTULOS ACADÊMICOS
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Títulos conquistados através de maestria, consistência e rigor acadêmico.
            </p>
          </div>
          <span className="text-xs font-mono text-accent font-bold">
            {titles.filter((t) => t.unlocked).length}/{titles.length} Desbloqueados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {titles.map((t) => {
            const isEquipped = user.title === t.name;
            return (
              <div
                key={t.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2.5 transition-all ${
                  isEquipped
                    ? 'border-accent bg-accent/10'
                    : t.unlocked
                    ? 'border-white/10 bg-bg-secondary'
                    : 'border-white/5 bg-bg-secondary/40 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-text-primary">
                      {t.name}
                    </span>
                    <span className="text-[9px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-white/5">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  {t.unlocked ? (
                    <button
                      onClick={() => handleEquipTitle(t.id)}
                      disabled={isEquipped || equipping}
                      className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded transition-colors ${
                        isEquipped
                          ? 'bg-accent text-white cursor-default'
                          : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary'
                      }`}
                    >
                      {isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] font-mono text-text-muted">
                      <Lock size={11} /> Bloqueado
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
