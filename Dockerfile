# Usa uma imagem base oficial do Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo package.json e package-lock.json para o container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos do projeto para o container
COPY --chown=node:node . .



# Expõe a porta onde a aplicação está rodando
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "start"]