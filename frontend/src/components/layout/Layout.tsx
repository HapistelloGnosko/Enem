import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, Zap } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Barra superior — só aparece em telas pequenas (celular) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/5 bg-bg-secondary sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white shrink-0">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="font-mono font-black text-xs tracking-widest text-text-primary">
              ENEM<span className="text-accent">QUEST</span>
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto max-h-screen p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
