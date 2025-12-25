"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CodeAnalyzer from "../../components/CodeAnalyzer";
import HistoryList from "../../components/HistoryList";

type ViewType = "analyzer" | "history";

export default function Dashboard() {
  const router = useRouter();
  const [view, setView] = useState<ViewType>("analyzer");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("humanflow_user_id");
    if (!userId) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("humanflow_user_id");
    router.push("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Verificando autenticação...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#0B1F3B] z-40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1F4ED8] to-[#2E7D32] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              HumanFlow AI
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setView("analyzer")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                view === "analyzer"
                  ? "bg-[#1F4ED8] text-white shadow-lg shadow-[#1F4ED8]/25"
                  : "bg-white text-[#0B1F3B] hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Analisar Código
            </button>
            <button
              onClick={() => setView("history")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                view === "history"
                  ? "bg-[#1F4ED8] text-white shadow-lg shadow-[#1F4ED8]/25"
                  : "bg-white text-[#0B1F3B] hover:bg-gray-50 border border-gray-200"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              📜 Meus Relatórios
            </button>
          </div>

          {/* Content */}
          {view === "analyzer" ? (
            <div className="max-w-3xl mx-auto">
              <CodeAnalyzer />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <button
                  onClick={() => setView("analyzer")}
                  className="flex items-center gap-2 text-[#1F4ED8] hover:text-[#0B1F3B] font-medium transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  ⬅️ Voltar para o Editor
                </button>
              </div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-8 bg-gradient-to-b from-[#1F4ED8] to-[#2E7D32] rounded-full" />
                <h2 className="text-2xl font-bold text-[#0B1F3B]">
                  Histórico de Análises
                </h2>
              </div>
              <HistoryList />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
