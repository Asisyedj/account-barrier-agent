'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Send,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { INITIAL_ACCOUNTS, AccountBarrier } from '@/lib/data';

interface Message {
  id: string;
  sender: 'rep' | 'agent';
  timestamp: string;
  text: string;
  accountData?: AccountBarrier;
}

export default function Chat() {
  const [query, setQuery] = useState('VP-V2');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      timestamp: '09:00 AM',
      text: 'Good morning, EMEA Clinical Specialist. I am your **VARIPULSE™ (VP-V2) Account-Barrier Copilot**.\n\nEnter an account code (e.g., `VP-V2`, `VP-CHARITE`, `VP-MILAN`) or describe the hospital barrier you are encountering to retrieve clinical evidence, procurement strategies, and the matching presentation deck.'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleLookup = (accountCodeToSearch?: string) => {
    const targetCode = (accountCodeToSearch || query).trim().toUpperCase();
    if (!targetCode) return;

    setLoading(true);

    const userMsg: Message = {
      id: 'msg-' + Date.now(),
      sender: 'rep',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Lookup account barrier status and strategy for code: ${targetCode}`
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const match = INITIAL_ACCOUNTS.find(
        (a) =>
          a.code.toUpperCase() === targetCode ||
          a.hospital.toLowerCase().includes(targetCode.toLowerCase()) ||
          a.name.toLowerCase().includes(targetCode.toLowerCase())
      );

      let agentMsg: Message;

      if (match) {
        agentMsg = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Account Identified: **${match.hospital}** (${match.code}). Barrier: **${match.barrierCategory}**.\n\nHere is your custom overcoming roadmap, presentation deck, and clinical counter-evidence for Dr. ${match.primaryElectrophysiologist.replace('Dr. ', '')}:`,
          accountData: match
        };
      } else {
        agentMsg = {
          id: 'agent-' + Date.now(),
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `No exact account code match for "${targetCode}".\n\nActive accounts available in your territory ledger:\n- **VP-V2** (London Heart / St. Thomas & Guy's NHS Trust - CapEx Freeze)\n- **VP-CHARITE** (Charité Universitätsmedizin Berlin - Clinical Durability)\n- **VP-MILAN** (IRCCS San Donato - Regional Tender RFP)\n\nClick any quick-select button below to view full barrier analysis.`
        };
      }

      setMessages((prev) => [...prev, agentMsg]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Pulsed Field Ablation (PFA)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Copilot v2.4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              VARIPULSE™ Medical Sales Account-Barrier Copilot
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Targeted clinical intelligence, CapEx objection handling, and fast-track tender decks for electrophysiologists and NHS hospital trusts across EMEA.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30"
            >
              <span>Ledger & Timer Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick select account pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1">Quick Select Account:</span>
          {INITIAL_ACCOUNTS.map((acc) => (
            <button
              key={acc.code}
              onClick={() => {
                setQuery(acc.code);
                handleLookup(acc.code);
              }}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-indigo-900/60 text-slate-300 hover:text-white border border-slate-700/60 hover:border-indigo-500/50 transition flex items-center gap-1.5"
            >
              <Building className="w-3 h-3 text-cyan-400" />
              <span>{acc.code}</span>
              <span className="text-slate-500 text-[10px]">({acc.barrierCategory})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-5 min-h-[460px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === 'rep' ? 'items-end' : 'items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-xs font-semibold text-slate-400">
                {m.sender === 'rep' ? 'Medical Sales Representative' : 'VARIPULSE™ AI Copilot'}
              </span>
              <span className="text-[10px] text-slate-600">{m.timestamp}</span>
            </div>

            <div
              className={`rounded-2xl p-4 sm:p-5 max-w-3xl leading-relaxed text-sm ${
                m.sender === 'rep'
                  ? 'bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs shadow-md'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Account Data Presentation Card */}
              {m.accountData && (
                <div className="mt-4 pt-4 border-t border-slate-700/80 space-y-4">
                  {/* Account overview banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">Hospital / Trust</div>
                        <div className="font-semibold text-white text-xs">{m.accountData.hospital}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase font-semibold">Key Electrophysiologist</div>
                        <div className="font-semibold text-white text-xs">{m.accountData.primaryElectrophysiologist}</div>
                      </div>
                    </div>
                  </div>

                  {/* Barrier Details */}
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Account Barrier: {m.accountData.barrierCategory}</span>
                    </div>
                    <p className="text-xs text-amber-200/90 leading-normal">
                      {m.accountData.barrierDescription}
                    </p>
                  </div>

                  {/* Clinical Talking Points */}
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-700/60">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider mb-2.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Empirical Clinical Arguments & Talking Points</span>
                    </div>
                    <ul className="space-y-2">
                      {m.accountData.clinicalTalkingPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Presentation Deck Card */}
                  <div className="bg-gradient-to-r from-indigo-950/80 to-slate-900 p-4 rounded-xl border border-indigo-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">
                          Recommended Presentation Deck
                        </div>
                        <div className="font-bold text-white text-xs sm:text-sm">
                          {m.accountData.recommendedDeckTitle}
                        </div>
                      </div>
                    </div>
                    <a
                      href={m.accountData.recommendedDeckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex-shrink-0 shadow-md shadow-indigo-600/30"
                    >
                      <span>Open Deck PDF</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Elapsed Days in Pipeline: <strong className="text-white">{m.accountData.daysElapsed} days</strong>
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                    >
                      <span>Simulate Follow-Up Triggers</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 text-slate-400 text-xs py-2 px-1">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>Analyzing hospital barrier ontology and matching clinical deck...</span>
          </div>
        )}
      </div>

      {/* Input Form Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 sm:p-3 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter account code (e.g. VP-V2, VP-CHARITE) or hospital name..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-600/30 flex-shrink-0"
          >
            <span>Analyze</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
