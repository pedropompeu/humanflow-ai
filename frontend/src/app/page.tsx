import UserRegister from "../components/UserRegister";

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
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#0B1F3B] via-[#0B1F3B]/80 to-[#F3F4F6] pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            HumanFlow AI
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-2">
            Entre para começar
          </p>
          <p className="text-gray-400 text-base max-w-xl mx-auto">
            Análise de código inteligente com IA. Detecte vulnerabilidades, bugs e code smells em segundos.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="flex flex-col items-center">
          <section className="w-full max-w-md">
            <UserRegister />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1F3B] py-6 mt-24">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 HumanFlow AI. Análise inteligente de código.
          </p>
        </div>
      </footer>
    </div>
  );
}
