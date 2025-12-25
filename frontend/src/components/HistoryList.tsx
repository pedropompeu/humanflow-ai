"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../services/api";
import ReportModal from "./ReportModal";

interface HistoryItem {
  id: string;
  repository_name: string;
  score: number | null;
  summary: string | null;
  created_at: string;
}

interface ReportDetail {
  id: string;
  repository_name: string;
  score: number | null;
  summary: string | null;
  issues: string[];
  created_at: string;
}

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getScoreColor = (score: number | null) => {
    if (score === null) return "bg-gray-400";
    if (score > 70) return "bg-[#2E7D32]";
    if (score > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "N/A";
    if (score > 70) return "Excelente";
    if (score > 40) return "Atenção";
    return "Crítico";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateSummary = (summary: string | null, maxLength = 100) => {
    if (!summary) return "Sem resumo disponível";
    if (summary.length <= maxLength) return summary;
    return summary.substring(0, maxLength) + "...";
  };

  const handleOpenReport = async (id: string) => {
    try {
      const response = await api.get(`/analysis/report/${id}`);
      setSelectedReport(response.data);
      setIsModalOpen(true);
    } catch {
      toast.error("Não foi possível carregar o relatório.");
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const userId = localStorage.getItem("humanflow_user_id");

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/analysis/history/${userId}`);
        setHistory(response.data);
      } catch {
        toast.error("Erro ao carregar histórico.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Carregando histórico...
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-[#0B1F3B] mb-2">Nenhuma análise ainda</h3>
        <p className="text-gray-500">
          Cadastre-se e analise seu primeiro código para ver o histórico aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenReport(item.id)}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1F4ED8]/10 hover:border-[#1F4ED8]/20 group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0B1F3B] truncate group-hover:text-[#1F4ED8] transition-colors">
                  {item.repository_name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(item.created_at)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-3">
                <div
                  className={`${getScoreColor(item.score)} text-white px-3 py-1 rounded-full text-sm font-bold`}
                >
                  {item.score ?? "N/A"}
                </div>
                <span className="text-xs text-gray-500">
                  {getScoreLabel(item.score)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">
              {truncateSummary(item.summary)}
            </p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-[#1F4ED8] font-medium group-hover:underline">
                Ver detalhes →
              </span>
            </div>
          </div>
        ))}
      </div>

      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        report={selectedReport}
      />
    </>
  );
}
