"use client";

import { useState } from "react";
import { api } from "../services/api";

export default function UserRegister() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/users/", {
        full_name: fullName,
        email,
        password,
      });

      const userId = response.data.id;
      localStorage.setItem("humanflow_user_id", userId);

      alert("Usuário criado e logado automaticamente!");
      setFullName("");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { detail?: string } } };
        alert(axiosError.response?.data?.detail || "Erro ao cadastrar usuário");
      } else {
        alert("Erro ao cadastrar usuário");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-[#0B1F3B] to-[#1F4ED8] p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Criar Conta</h2>
            <p className="text-blue-200 text-sm">Comece a analisar seu código</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#0B1F3B] mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/20 transition-all outline-none"
            placeholder="Seu nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1F3B] mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/20 transition-all outline-none"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0B1F3B] mb-2">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/20 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#0B1F3B] to-[#1F4ED8] text-white py-3.5 px-4 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-[#1F4ED8]/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Criando conta...
            </span>
          ) : (
            "Criar Conta Gratuita"
          )}
        </button>
      </form>
    </div>
  );
}
