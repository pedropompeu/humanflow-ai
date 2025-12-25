# Use a imagem oficial do Python
FROM python:3.11-slim

# Defina o diretório de trabalho no container
WORKDIR /app

# Instale as dependências do sistema necessárias para compilar pacotes como psycopg2
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && apt-get clean

# Copie o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY ./requirements.txt /app/requirements.txt

# Instale as dependências do Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copie o resto do código da aplicação
COPY ./app /app/app

# Copie os arquivos do Alembic para migrações
COPY ./alembic.ini /app/alembic.ini
COPY ./alembic /app/alembic

# Exponha a porta que a aplicação vai rodar
EXPOSE 8000

# Comando para rodar a aplicação com uvicorn em modo de desenvolvimento (reload)
# O main.py deve estar dentro de uma pasta 'app' na raiz do backend
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
