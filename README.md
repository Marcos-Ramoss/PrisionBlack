# PrisionBlack

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v4.21.2-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.10.1-brightgreen.svg)](https://www.mongodb.com/)

PrisionBlack é um sistema de gestão prisional completo, projetado para gerenciar detentos, celas, relatórios, visitas e pessoal administrativo de forma eficiente e segura.

![PrisionBlack Screenshot](public/img/screenshot.png)

## Recursos Principais

- 🔒 Sistema de autenticação e autorização seguro
- 👮 Gerenciamento completo de detentos
- 🏢 Controle de celas e alocações
- 📋 Geração de relatórios detalhados
- 👪 Gestão de visitas familiares e de advogados
- 👥 Administração de usuários com diferentes níveis de acesso
- 📱 Interface responsiva e intuitiva

## Pré-requisitos

Para executar esta aplicação, você precisará:

- Node.js (versão 20 ou superior)
- npm ou yarn
- MongoDB (instalado localmente ou um serviço remoto)
- Git

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/PrisionBlack.git
cd PrisionBlack
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/prisionblack
SESSION_SECRET=sua_chave_secreta_aqui
JWT_SECRET=outra_chave_secreta_aqui
```

### 4. Inicie o servidor

```bash
npm start
```

Para ambiente de desenvolvimento, use:

```bash
npm run dev
```

### 5. Acesse a aplicação

Abra seu navegador e acesse `http://localhost:3000`

## Usando com Docker

Você também pode executar a aplicação usando Docker:

```bash
docker-compose up
```

## Arquitetura do Sistema

O PrisionBlack segue uma arquitetura MVC (Model-View-Controller) com as seguintes camadas:

```
PrisionBlack/
├── app/                  # Núcleo da aplicação
│   ├── config/           # Configurações (BD, upload, etc)
│   ├── controllers/      # Controladores de rotas
│   ├── middlewares/      # Middlewares da aplicação
│   ├── models/           # Modelos de dados MongoDB
│   ├── routes/           # Definição de rotas
│   ├── services/         # Serviços de negócio
│   └── utils/            # Utilitários
├── public/               # Arquivos estáticos
├── views/                # Templates EJS
├── server.js             # Ponto de entrada da aplicação
└── docker-compose.yml    # Configuração Docker
```

### Diagrama de Fluxo de Dados

```
Cliente → Requisição HTTP → Express Server → Middleware de Autenticação → Rota → Controlador → Serviço → Modelo → MongoDB
   ↑                                                                                                ↓
   └────────────────────── Resposta HTTP ← Template EJS ← Dados processados ←─────────────────────┘
```


## Contato

Marcos - [contato@email.com](mailto:mar.stark.99@gmail.com)

Link do projeto: [https://github.com/Marcos-Ramoss/PrisionBlack](https://github.com/Marcos-Ramoss/PrisionBlack)


