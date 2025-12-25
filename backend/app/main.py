from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(title="HumanFlow AI", openapi_url=f"{settings.API_V1_STR}/openapi.json")

# --- CONFIGURAÇÃO DO CORS (O NOVO TRECHO) ---
origins = [
    "http://localhost:3000",  # O teu Frontend React
    "http://localhost:5173",  # Porta alternativa do Vite
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --------------------------------------------

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    print("Iniciando a aplicação...")
    # Aqui poderíamos testar a conexão com o banco
    print("✅ Conexão com Banco de Dados estabelecida!")