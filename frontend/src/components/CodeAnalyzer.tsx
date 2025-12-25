"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { api } from "../services/api";

interface AnalysisResult {
  score: number;
  summary: string;
  issues: string[];
}

export default function CodeAnalyzer() {
  const [sourceCode, setSourceCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getScoreColor = (score: number) => {
    if (score > 70) return "bg-[#2E7D32]";
    if (score > 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score > 70) return "Excelente";
    if (score > 40) return "Atenção";
    return "Crítico";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tamanho (1MB)
    if (file.size > 1024 * 1024) {
      toast.error("Arquivo muito grande. Limite de 1MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      setSourceCode(content);
      toast.success(`Arquivo "${file.name}" carregado com sucesso!`);
    };
    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo.");
    };
    reader.readAsText(file);

    // Limpar input para permitir recarregar o mesmo arquivo
    e.target.value = "";
  };

  const handleAnalyze = async () => {
    const userId = localStorage.getItem("humanflow_user_id");

    if (!userId) {
      toast.warning("Cadastre-se primeiro para analisar código.");
      return;
    }

    if (!sourceCode.trim()) {
      toast.warning("Cole algum código para analisar.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const repoName = "Analysis " + new Date().toLocaleString();

      const repoResponse = await api.post("/repositories/", {
        name: repoName,
        url: "http://manual-upload",
        description: "Manual Analysis",
        owner_id: userId,
      });

      const repositoryId = repoResponse.data.id;

      const analysisResponse = await api.post("/analysis/analyze", {
        repository_id: repositoryId,
        code: sourceCode,
      });

      setResult(analysisResponse.data.full_report || analysisResponse.data);
      toast.success("Análise concluída com sucesso!");
    } catch {
      toast.error("Falha ao conectar com a IA. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1F4ED8]/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#1F4ED8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Análise de Inteligência Artificial</h2>
            <p className="text-gray-400 text-sm">Cole seu código ou faça upload de um arquivo</p>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="p-6 space-y-4">
        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-700">
          {/* Editor Tab Bar */}
          <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
              </div>
              <div className="ml-4 flex items-center gap-2 bg-[#1e1e1e] px-3 py-1 rounded-t-md border-t border-l border-r border-gray-600">
                <svg className="w-4 h-4 text-[#3572A5]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                </svg>
                <span className="text-gray-300 text-sm font-medium">main.py</span>
              </div>
            </div>
            <span className="text-gray-500 text-xs">Python</span>
          </div>
          
          {/* Code Editor Area */}
          <textarea
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            rows={12}
            className="w-full px-4 py-4 bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4ED8]/50 resize-none"
            placeholder={`def hello_world():
    print('Hello, World!')

# Cole seu código Python aqui...`}
            spellCheck={false}
            style={{ fontFamily: '"Fira Code", "Consolas", monospace', lineHeight: 1.6 }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 active:scale-[0.98] transition-all duration-200 border border-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload
          </button>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex-1 bg-[#1F4ED8] text-white py-4 px-6 rounded-xl font-semibold hover:bg-[#1F4ED8]/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-[#1F4ED8]/25"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analisando com IA...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analisar Código
              </>
            )}
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".py,.js,.ts,.tsx,.jsx,.txt,.md,.json,.html,.css"
          onChange={handleFileUpload}
        />
      </div>

      {/* Results */}
      {result && (
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#0B1F3B]">Resultado da Análise</h3>
            <div className={`${getScoreColor(result.score)} text-white px-4 py-2 rounded-full font-bold flex items-center gap-2`}>
              <span>{result.score}/100</span>
              <span className="text-xs opacity-80">({getScoreLabel(result.score)})</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Resumo</h4>
            <p className="text-[#0B1F3B]">{result.summary}</p>
          </div>

          {result.issues && result.issues.length > 0 && (
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-3">
                Issues Encontradas ({result.issues.length})
              </h4>
              <ul className="space-y-2">
                {result.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-3 text-[#0B1F3B]">
                    <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
