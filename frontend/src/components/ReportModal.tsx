"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, TriangleAlert, CheckCircle, FileText, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface ReportData {
  id: string;
  repository_name: string;
  score: number | null;
  summary: string | null;
  issues: string[];
  created_at: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ReportData | null;
}

export default function ReportModal({ isOpen, onClose, report }: ReportModalProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!mounted || !isOpen || !report) return null;

  const getScoreColor = (score: number | null) => {
    if (score === null) return { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-500" };
    if (score > 70) return { bg: "bg-green-50", border: "border-[#2E7D32]", text: "text-[#2E7D32]" };
    if (score > 40) return { bg: "bg-yellow-50", border: "border-yellow-500", text: "text-yellow-600" };
    return { bg: "bg-red-50", border: "border-red-500", text: "text-red-500" };
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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleAutoFix = () => {
    toast.info("Funcionalidade Auto-Fix em breve! 🚀");
  };

  const scoreColors = getScoreColor(report.score);

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? "bg-[#0B1F3B]/80 backdrop-blur-sm" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B1F3B] p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1F4ED8]/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#1F4ED8]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {report.repository_name}
                </h2>
                <p className="text-gray-400 text-sm">
                  {formatDate(report.created_at)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Score Donut */}
          <div className="flex justify-center mb-8">
            <div className={`relative w-32 h-32 rounded-full ${scoreColors.bg} border-4 ${scoreColors.border} flex items-center justify-center`}>
              <div className="text-center">
                <span className={`text-3xl font-bold ${scoreColors.text}`}>
                  {report.score ?? "N/A"}
                </span>
                <p className={`text-xs font-medium ${scoreColors.text}`}>
                  {getScoreLabel(report.score)}
                </p>
              </div>
              {/* Decorative ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${(report.score || 0) * 2.83} 283`}
                  className={scoreColors.text}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#1F4ED8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#1F4ED8]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0B1F3B] mb-1">Resumo da Análise</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {report.summary || "Sem resumo disponível"}
                </p>
              </div>
            </div>
          </div>

          {/* Issues */}
          {report.issues && report.issues.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-[#0B1F3B] mb-3 flex items-center gap-2">
                <TriangleAlert className="w-4 h-4 text-yellow-500" />
                Issues Encontradas ({report.issues.length})
              </h3>
              <div className="space-y-2">
                {report.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#1F4ED8]/30 hover:shadow-md transition-all duration-200 cursor-default"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TriangleAlert className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-[#2E7D32]/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#2E7D32]/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#2E7D32]">Código Limpo!</h3>
                  <p className="text-[#2E7D32]/70 text-sm">Nenhuma issue encontrada na análise.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handleAutoFix}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Wand2 className="w-5 h-5" />
              Gerar Correção com IA
            </button>
            <button
              onClick={onClose}
              className="px-6 bg-[#0B1F3B] hover:bg-[#0B1F3B]/90 text-white py-3 rounded-xl font-medium transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
