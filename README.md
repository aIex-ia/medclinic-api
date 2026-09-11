# MedClinic API

## 1. Descrição do Projeto
O **MedClinic API** é uma API REST desenvolvida para o gerenciamento de uma clínica médica de pequeno porte. 

## 2. Escopo da Etapa
Nesta etapa inicial (Etapa 1), o projeto foca exclusivamente na base de **autenticação e autorização**. Foram implementadas as funcionalidades de:
- Cadastro de usuários com hash de senhas (bcrypt).
- Login com emissão de token JWT.
- Proteção de rotas com middleware de autenticação.
- Controle de acesso baseado em perfis (RBAC).

## 3. Tecnologias Utilizadas
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- TypeORM
- JWT (JSON Web Token)
- bcrypt

## 4. Requisitos para Execução
- Node.js (v18 ou superior recomendado)
- npm ou yarn
- PostgreSQL instalado e em execução (ou via Docker)

## 5. Instalação
Clone este repositório e instale as dependências:
```bash
git clone https://github.com/aIex-ia/medclinic-api.git
cd medclinic-api
npm install
```

## 6. Configuração do PostgreSQL e Banco de Dados
Para rodar a aplicação, é necessário ter um banco de dados PostgreSQL.
1. Inicie seu servidor PostgreSQL.
2. Crie um banco de dados chamado `medclinic` (ou outro nome de sua preferência).
3. Caso utilize o Docker, você pode rodar:
   ```bash
   docker run --name medclinic-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

## 7. Variáveis de Ambiente (.env)
Crie um arquivo `.env` na raiz do projeto, baseado no arquivo `.env.example`.
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=medclinic
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=1h
PORT=3000
```

## 8. Criação do Banco de Dados / Migrations
O projeto utiliza o TypeORM. Para criar as tabelas no banco de dados automaticamente, execute as migrations:
```bash
npm run migration:run
```
Este comando criará a tabela `users` necessária.

## 9. Execução
Para rodar em ambiente de desenvolvimento (utiliza `ts-node-dev` para recarregar automaticamente):
```bash
npm run dev
```

Para rodar em produção (build e start):
```bash
npm run build
npm start
```

## 10. Arquitetura
O projeto segue a arquitetura MVC organizada em camadas para promover a separação de responsabilidades:
- **Routes:** Definição dos endpoints da API e mapeamento para os controllers correspondentes.
- **Middlewares:** Interceptação das requisições para validação de JWT, controle de RBAC e tratamento centralizado de erros.
- **Controllers:** Recepção de requisições, tratamento de entrada (body, params) e acionamento dos serviços.
- **Services:** Implementação das regras de negócio.
- **Repositories:** Isolamento da camada de persistência que se comunica com o PostgreSQL via TypeORM.
- **Entities:** Modelos mapeados pelo TypeORM.
- **DTOs:** Definição das interfaces de trânsito de dados (Data Transfer Objects).
- **Utils / Database:** Funções utilitárias e configuração central do banco de dados.

## 11. Estrutura de Pastas
```
src/
├── controllers/
├── database/
│   ├── migrations/
│   └── data-source.ts
├── dtos/
├── entities/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
└── server.ts
```

## 12. Autenticação e Perfis (RBAC)
A autenticação utiliza tokens **JWT**.
Após o `/auth/login`, você deve enviar o token JWT gerado no header `Authorization` como `Bearer TOKEN` nas requisições protegidas.

### Perfis Disponíveis
- **ADMINISTRADOR:** Acesso completo.
- **ATENDENTE:** Acesso operacional restrito.

## 13. Endpoints e Exemplos

### 13.1. Cadastrar Usuário (`POST /auth/register`)
- **Rota:** `/auth/register`
- **Autenticação:** Não exige token
- **Body:**
```json
{
  "nome": "João da Silva",
  "email": "joao@email.com",
  "senha": "senhaforte123"
}
```
- **Response (201 Created):**
```json
{
  "id": "e93f8e65-2766-4c4c-83b6-2009adbe0b7a",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "role": "ATENDENTE",
  "createdAt": "2023-10-10T12:00:00.000Z"
}
```

### 13.2. Realizar Login (`POST /auth/login`)
- **Rota:** `/auth/login`
- **Autenticação:** Não exige token
- **Body:**
```json
{
  "email": "joao@email.com",
  "senha": "senhaforte123"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "e93f8e65-2766-4c4c-83b6-2009adbe0b7a",
    "nome": "João da Silva",
    "email": "joao@email.com",
    "role": "ATENDENTE",
    "createdAt": "2023-10-10T12:00:00.000Z"
  }
}
```

### 13.3. Retornar Dados do Usuário (`GET /users/me`)
- **Rota:** `/users/me`
- **Autenticação:** Exige token válido
- **Header:** `Authorization: Bearer SEU_TOKEN`
- **Response (200 OK):**
```json
{
  "id": "e93f8e65-2766-4c4c-83b6-2009adbe0b7a",
  "nome": "João da Silva",
  "email": "joao@email.com",
  "role": "ATENDENTE",
  "createdAt": "2023-10-10T12:00:00.000Z"
}
```

### 13.4. Rota Restrita Administrador (`GET /admin/ping`)
- **Rota:** `/admin/ping`
- **Autenticação:** Exige token válido e perfil de `ADMINISTRADOR`
- **Header:** `Authorization: Bearer SEU_TOKEN`
- **Response (200 OK):**
```json
{
  "message": "pong"
}
```
- **Response se o usuário for apenas ATENDENTE (403 Forbidden):**
```json
{
  "status": "error",
  "message": "Sem permissão para acessar este recurso"
}
```

## 14. Comandos Disponíveis
- `npm run dev`: Inicializa em desenvolvimento via ts-node-dev.
- `npm run build`: Transpila o TypeScript para a pasta `dist/`.
- `npm start`: Inicializa o servidor compilado.
- `npm run typeorm`: CLI do TypeORM.
- `npm run migration:generate`: Gera novas migrations.
- `npm run migration:run`: Roda as migrations pendentes no BD.
