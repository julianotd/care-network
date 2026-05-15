'use client';

import { useState } from 'react';
import { Dashboard } from '@/components/Dashboard';
import { Agenda } from '@/components/Agenda';
import { PacienteView } from '@/components/PacienteView';
import { Feed } from '@/components/Feed';
import { Chat } from '@/components/Chat';
import { DiarioBordo } from '@/components/DiarioBordo';
import { PlanoTerapeuticoView } from '@/components/PlanoTerapeutico';
import { PACIENTES } from '@/lib/mock-data';

type Tab = 'dashboard' | 'agenda' | 'paciente' | 'feed' | 'chat' | 'diario' | 'plano';

export default function Home() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [pacienteSel, setPacienteSel] = useState(PACIENTES[0]);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { key: 'agenda', label: 'Agenda', icon: '📅' },
    { key: 'paciente', label: 'Pacientes', icon: '👤' },
    { key: 'feed', label: 'Feed', icon: '📱' },
    { key: 'chat', label: 'Chat', icon: '💬' },
    { key: 'diario', label: 'Diário', icon: '📔' },
    { key: 'plano', label: 'Plano Terapêutico', icon: '📋' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤝</span>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Care Network</h1>
            <p className="text-indigo-200 text-xs">Ecossistema de Cuidado em Rede</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            className="bg-indigo-500 text-white text-sm rounded-lg px-3 py-1.5 border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            value={pacienteSel.id}
            onChange={(e) => setPacienteSel(PACIENTES.find(p => p.id === e.target.value)!)}
          >
            {PACIENTES.map(p => (
              <option key={p.id} value={p.id}>{p.nome} — {p.humorHoje}</option>
            ))}
          </select>
          <div className="text-right">
            <p className="text-sm font-medium">Dra. Marina Silva</p>
            <p className="text-xs text-indigo-200">Coordenadora Clínica</p>
          </div>
          <div className="w-9 h-9 bg-indigo-400 rounded-full flex items-center justify-center text-sm font-bold">MS</div>
        </div>
      </header>

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 px-6 flex gap-1 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              tab === t.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>{t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {tab === 'dashboard' && <Dashboard onSelectPaciente={(id) => { setPacienteSel(PACIENTES.find(p => p.id === id)!); setTab('paciente'); }} />}
        {tab === 'agenda' && <Agenda />}
        {tab === 'paciente' && <PacienteView paciente={pacienteSel} />}
        {tab === 'feed' && <Feed pacienteId={pacienteSel.id} />}
        {tab === 'chat' && <Chat pacienteId={pacienteSel.id} />}
        {tab === 'diario' && <DiarioBordo pacienteId={pacienteSel.id} />}
        {tab === 'plano' && <PlanoTerapeuticoView pacienteId={pacienteSel.id} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs px-6 py-3 flex justify-between">
        <span>Care Network v0.1.0 — MVP</span>
        <span>🔒 LGPD Compliant · Círculos de Cuidado · Dados Criptografados</span>
      </footer>
    </div>
  );
}
