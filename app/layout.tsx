import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'VARIPULSE (VP-V2) Account Barrier Agent',
  description: 'EMEA Medical Sales Account-Barrier Resolution & Commercial Ops Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
                VP
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  VARIPULSE™ Commercial Ops
                </span>
                <span className="ml-2 text-xs uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold tracking-wider">
                  VP-V2 Agent
                </span>
              </div>
            </div>
            <nav className="flex items-center space-x-2">
              <Link
                href="/"
                className="px-3.5 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                Chat Agent
              </Link>
              <Link
                href="/dashboard"
                className="px-3.5 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <span>Live Ledger & Simulator</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">{children}</main>

        <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
          VARIPULSE™ Medical Sales Account-Barrier Platform &bull; EMEA EP Division &bull; Microsoft Copilot Studio & Dataverse Compatible
        </footer>
      </body>
    </html>
  );
}
