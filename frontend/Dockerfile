# frontend/Dockerfile

# MUDANÇA AQUI: Usar Node 20 (Requisito do Next.js 16)
FROM node:20-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o resto do código fonte
COPY . .

# Expor a porta 3000
EXPOSE 3000

# Comando para rodar em modo desenvolvimento
CMD ["npm", "run", "dev"]