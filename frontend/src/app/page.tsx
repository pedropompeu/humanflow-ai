import UserRegister from "../components/UserRegister";
import CodeAnalyzer from "../components/CodeAnalyzer";
import HistoryList from "../components/HistoryList";

export default function Home() {
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
          <nav className="flex items-center gap-6">
            <span className="text-gray-300 text-sm">Code Analysis Platform</span>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#0B1F3B] via-[#0B1F3B]/80 to-[#F3F4F6] pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Análise de Código com IA
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Identifique problemas de segurança, performance e boas práticas em segundos
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="flex flex-col items-center gap-12">
          {/* User Register */}
          <section className="w-full max-w-md">
            <UserRegister />
          </section>

          {/* Divider */}
          <div className="w-full max-w-2xl flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent" />
            <span className="text-gray-500 text-sm">ou analise seu código</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-400/30 to-transparent" />
          </div>

          {/* Code Analyzer */}
          <section className="w-full max-w-3xl">
            <CodeAnalyzer />
          </section>

          {/* History Section */}
          <section className="w-full max-w-4xl pb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-gradient-to-b from-[#1F4ED8] to-[#2E7D32] rounded-full" />
              <h2 className="text-2xl font-bold text-[#0B1F3B]">
                Histórico de Análises
              </h2>
            </div>
            <HistoryList />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1F3B] py-6 mt-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 HumanFlow AI. Análise inteligente de código.
          </p>
        </div>
      </footer>
    </div>
  );
}
