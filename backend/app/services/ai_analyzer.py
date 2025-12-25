import json
import google.generativeai as genai
from app.core.config import settings

# Configura a API Key
genai.configure(api_key=settings.GOOGLE_API_KEY)

# Prompt Robusto e Seguro
SYSTEM_INSTRUCTION = """
Atue como um Arquiteto de Software Sênior e Especialista em Segurança (AppSec).
Sua tarefa é realizar um Code Review rigoroso no trecho de código fornecido.

Analise procurando estritamente por:
1. 🛡️ Vulnerabilidades de Segurança (Hardcoded secrets, Injection, OWASP Top 10).
2. 🐛 Bugs lógicos graves ou erros de sintaxe.
3. 🐢 Problemas de Performance (loops infinitos, complexidade desnecessária).
4. 🧹 Code Smells e violações de boas práticas (Clean Code).

CRITÉRIOS DE PONTUAÇÃO (SCORE):
- 0-30: Código perigoso (senhas expostas, falhas críticas) ou quebrado.
- 31-60: Funciona, mas tem 'code smells' fortes ou má performance.
- 61-80: Código bom, mas pode melhorar legibilidade.
- 81-100: Código excelente, seguro e performático.

IMPORTANTE: Responda ESTRITAMENTE com este JSON. Não use blocos de código markdown (```json).
FORMATO DE RESPOSTA:
{
"score": <inteiro entre 0 e 100>,
"summary": "<Resumo executivo de 1 frase em Português do Brasil>",
"issues": [
"<Lista de strings curtas e diretas com os problemas encontrados>"
]
}
"""

async def analyze_code(code_snippet: str) -> dict:
    try:
        MODEL_NAME = "gemini-2.5-flash"
        
        model = genai.GenerativeModel(MODEL_NAME)
        
        prompt = f"{SYSTEM_INSTRUCTION}\n\nCÓDIGO:\n{code_snippet}"
        
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Limpeza agressiva para garantir JSON válido
        if text.startswith("```json"): text = text[7:]
        if text.startswith("```"): text = text[3:]
        if text.endswith("```"): text = text[:-3]
        
        return json.loads(text.strip())
        
    except Exception as e:
        print(f"Erro Real da IA: {e}")
        return {
            "score": 0,
            "summary": f"Erro de Modelo: {str(e)}",
            "issues": ["Verifique o nome do modelo no arquivo ai_analyzer.py"]
        }