'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FastForward,
  RotateCcw,
  Bell,
  Mail,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building,
  ShieldAlert,
  ArrowLeft,
  FileSpreadsheet,
  Activity,
  Send,
  Zap
} from 'lucide-react';
import { INITIAL_ACCOUNTS, AccountBarrier, AuditLogEntry } from '@/lib/data';

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<AccountBarrier[]>(INITIAL_ACCOUNTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '2026-11-23 10:15:00',
      accountCode: 'VP-V2',
      eventType: 'Deck Sent',
      channel: 'Dataverse Sync',
      recipient: 'arthur.davies@gstt.nhs.uk',
      message: 'VARIPULSE™ TRUPULSE™ Generator Dual-Use & ROI Economic Model (v2.4) delivered.',
      status: 'DELIVERED'
    },
    {
      id: 'log-2',
      timestamp: '2026-11-23 09:30:00',
      accountCode: 'VP-MILAN',
      eventType: 'Rep Follow-up Due',
      channel: 'Teams Channel',
      recipient: 'EMEA-Southern-Sales-Rep@varipulse.com',
      message: 'Automated 14-day check-in: San Donato regional tender RFP response pending procurement committee.',
      status: 'DELIVERED'
    }
  ]);
  const [simulatorNotice, setSimulatorNotice] = useState<string | null>(null);

  const triggerAudit = (
    accountCode: string,
    eventType: AuditLogEntry['eventType'],
    channel: AuditLogEntry['channel'],
    recipient: string,
    message: string
  ) => {
    const newLog: AuditLogEntry = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      accountCode,
      eventType,
      channel,
      recipient,
      message,
      status: 'SIMULATED'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Fast forward by +3 Days
  const handleFastForward3Days = () => {
    setSimulatorNotice('Fast-forwarded +3 Days: Automated follow-up evaluations executed.');
    setAccounts((prev) =>
      prev.map((acc) => {
        const nextDays = acc.daysElapsed + 3;
        let nextStatus = acc.status;

        if (nextDays >= 7 && acc.status === 'Open') {
          nextStatus = 'Follow-up Due';
          triggerAudit(
            acc.code,
            'Rep Follow-up Due',
            'Teams Channel',
            `rep.${acc.region.toLowerCase().replace(/[^a-z0-9]/g, '')}@varipulse.com`,
            `[+3 Days Trigger] Automated Reminder: Check-in with ${acc.primaryElectrophysiologist} at ${acc.hospital}. Barrier: ${acc.barrierCategory}.`
          );
        }
        return {
          ...acc,
          daysElapsed: nextDays,
          status: nextStatus,
          lastAction: `Fast-forwarded +3 days (Day ${nextDays})`
        };
      })
    );
  };

  // Fast forward by +2 Weeks (14 Days)
  const handleFastForward2Weeks = () => {
    setSimulatorNotice('Fast-forwarded +2 Weeks: High-priority manager escalation alerts triggered for stalled accounts.');
    setAccounts((prev) =>
      prev.map((acc) => {
        const nextDays = acc.daysElapsed + 14;
        let nextStatus = acc.status;

        if (nextDays >= 14 && acc.status !== 'Resolved') {
          nextStatus = 'Escalated';
          triggerAudit(
            acc.code,
            'Manager Escalation Alert',
            'SendGrid Email',
            'emea-commercial-director@varipulse.com',
            `[+2 Weeks Alert] Escalation: Account ${acc.code} (${acc.hospital}) barrier stalled for ${nextDays} days. Immediate sales director intervention recommended.`
          );
          triggerAudit(
            acc.code,
            'Rep Follow-up Due',
            'Teams Channel',
            'EMEA-Leadership-Escalation-Hub',
            `Teams Bot Notification: High-priority account ${acc.code} flagged as ESCALATED.`
          );
        }
        return {
          ...acc,
          daysElapsed: nextDays,
          status: nextStatus,
          lastAction: `Fast-forwarded +14 days (Day ${nextDays})`
        };
      })
    );
  };

  // Reset to initial baseline
  const handleReset = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setSimulatorNotice('Simulator ledger reset to default baseline.');
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              href="/"
              className="text-slate-400 hover:text-white text-xs inline-flex items-center gap-1 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Chat Agent</span>
            </Link>
            <span className="text-slate-600">&bull;</span>
            <span className="text-xs font-semibold text-cyan-400">Commercial Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>CRM-less Ledger & Timer Simulator</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Simulation Mode: Active
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Simulate medical sales follow-up cadences, automated Teams webhooks, and executive escalation triggers without external CRM dependencies.
          </p>
        </div>

        {/* Simulator Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-xl">
          <button
            onClick={handleFastForward3Days}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25"
          >
            <FastForward className="w-4 h-4" />
            <span>+3 Days Fast-Forward</span>
          </button>
          <button
            onClick={handleFastForward2Weeks}
            className="px-3.5 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md shadow-amber-600/25"
          >
            <Zap className="w-4 h-4" />
            <span>+2 Weeks Escalation</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition flex items-center gap-1.5"
            title="Reset ledger to Day 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Simulator Notification toast */}
      {simulatorNotice && (
        <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-xl px-4 py-3 flex items-center justify-between text-xs text-cyan-200 shadow-lg">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-pulse" />
            <span>{simulatorNotice}</span>
          </div>
          <button
            onClick={() => setSimulatorNotice(null)}
            className="text-cyan-400 hover:text-white font-semibold ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Account Barrier Ledger Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white text-base">Active Account Barrier Ledger</h2>
          </div>
          <span className="text-xs text-slate-400">
            Showing <strong className="text-white">{accounts.length}</strong> monitored hospital accounts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-semibold border-b border-slate-800/80 tracking-wider">
              <tr>
                <th className="py-3 px-4">Account Code</th>
                <th className="py-3 px-4">Hospital & Electrophysiologist</th>
                <th className="py-3 px-4">Identified Barrier</th>
                <th className="py-3 px-4">Elapsed Pipeline</th>
                <th className="py-3 px-4">Lifecycle Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {accounts.map((acc) => (
                <tr key={acc.code} className="hover:bg-slate-800/40 transition">
                  <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/60 text-[11px] font-mono">
                        {acc.code}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-white">{acc.hospital}</div>
                    <div className="text-[11px] text-slate-400">{acc.primaryElectrophysiologist} &bull; {acc.region}</div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-medium text-amber-300">{acc.barrierCategory}</div>
                    <div className="text-[11px] text-slate-400 truncate" title={acc.barrierDescription}>
                      {acc.barrierDescription}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className={acc.daysElapsed >= 14 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {acc.daysElapsed} days
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    {acc.status === 'Open' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" />
                        <span>Open (Normal)</span>
                      </span>
                    )}
                    {acc.status === 'Follow-up Due' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Bell className="w-3 h-3" />
                        <span>Follow-up Due</span>
                      </span>
                    )}
                    {acc.status === 'Escalated' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse">
                        <ShieldAlert className="w-3 h-3" />
                        <span>Escalated to Director</span>
                      </span>
                    )}
                    {acc.status === 'Resolved' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700/40 text-slate-300 border border-slate-600">
                        <span>Resolved</span>
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        triggerAudit(
                          acc.code,
                          'Rep Follow-up Due',
                          'Teams Channel',
                          `rep.${acc.region.toLowerCase().replace(/[^a-z0-9]/g, '')}@varipulse.com`,
                          `Manual Trigger: On-demand check-in dispatched for ${acc.hospital}.`
                        );
                        setSimulatorNotice(`Check-in notification dispatched to Teams for ${acc.code}.`);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-900/60 text-slate-300 hover:text-white border border-slate-700 hover:border-indigo-500 text-[11px] font-medium transition"
                    >
                      Trigger Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Commercial Ops Audit Log */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-white text-base">Commercial Ops Audit Log & Dispatch Stream</h2>
          </div>
          <span className="text-xs text-slate-400">
            Automated Webhook & SendGrid Mock Stream
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-3">
          {auditLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              No audit log events recorded yet. Fast-forward the simulator to generate automated events.
            </div>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      log.eventType === 'Manager Escalation Alert'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : log.eventType === 'Rep Follow-up Due'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    }`}
                  >
                    {log.eventType === 'Manager Escalation Alert' ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-white">{log.eventType}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                        {log.accountCode}
                      </span>
                      <span className="text-[10px] text-slate-500">&bull; {log.channel}</span>
                    </div>
                    <div className="text-slate-300">{log.message}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: <span className="font-mono text-slate-400">{log.recipient}</span>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-1 flex-shrink-0 text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {log.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
