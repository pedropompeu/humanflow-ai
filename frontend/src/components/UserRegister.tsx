"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "../services/api";

interface User {
  id: string;
  email: string;
  full_name: string;
}

export default function UserRegister() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de confirmação de senha no cadastro
    if (!isLogin && password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    // Validação de senha mínima
    if (!isLogin && password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Modo Login
        const response = await api.get("/users/");
        const users: User[] = response.data;
        
        const user = users.find((u) => u.email === email);
        
        if (user) {
          localStorage.setItem("humanflow_user_id", user.id);
          toast.success("Login realizado com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        } else {
          toast.error("Usuário não encontrado. Crie uma conta.");
        }
      } else {
        // Modo Cadastro
        const response = await api.post("/users/", {
          full_name: fullName,
          email,
          password,
        });

        const userId = response.data.id;
        localStorage.setItem("humanflow_user_id", userId);

        toast.success("Conta criada com sucesso! Redirecionando...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { detail?: string } } };
        toast.error(axiosError.response?.data?.detail || "Erro ao processar. Verifique os dados.");
      } else {
        toast.error("Erro ao processar. Verifique os dados.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex">
        <button
          type="button"
          onClick={() => {
            setIsLogin(true);
            clearForm();
          }}
          className={`flex-1 py-4 text-center font-semibold transition-all ${
            isLogin
              ? "bg-gradient-to-r from-[#0B1F3B] to-[#1F4ED8] text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => {
            setIsLogin(false);
            clearForm();
          }}
          className={`flex-1 py-4 text-center font-semibold transition-all ${
            !isLogin
              ? "bg-gradient-to-r from-[#0B1F3B] to-[#1F4ED8] text-white"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Cadastrar
        </button>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1F3B] to-[#1F4ED8] p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isLogin ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              )}
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isLogin ? "Bem-vindo de volta!" : "Criar Conta"}
            </h2>
            <p className="text-blue-200 text-sm">
              {isLogin ? "Entre para continuar analisando" : "Comece a analisar seu código"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[#0B1F3B] mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={!isLogin}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/20 transition-all outline-none"
              placeholder="Seu nome completo"
            />
          </div>
        )}

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
            minLength={isLogin ? undefined : 6}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#1F4ED8] focus:ring-2 focus:ring-[#1F4ED8]/20 transition-all outline-none"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[#0B1F3B] mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={!isLogin}
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:ring-2 transition-all outline-none ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 focus:border-[#1F4ED8] focus:ring-[#1F4ED8]/20"
              }`}
              placeholder="••••••••"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">As senhas não coincidem</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!isLogin && password !== confirmPassword)}
          className="w-full bg-gradient-to-r from-[#0B1F3B] to-[#1F4ED8] text-white py-3.5 px-4 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-[#1F4ED8]/25"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {isLogin ? "Entrando..." : "Criando conta..."}
            </span>
          ) : (
            isLogin ? "Entrar na Plataforma" : "Criar Conta Gratuita"
          )}
        </button>
      </form>
    </div>
  );
}
