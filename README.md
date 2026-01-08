# Projeto Full Stack Angular + ASP.NET

Aplicação web **full stack** em desenvolvimento, focada em **Gestão Financeira**, utilizando Angular no frontend e ASP.NET Core no backend.
Este projeto pessoal tem como principal objetivo **relembrar, praticar e atualizar conhecimentos em Angular**, bem como consolidar a integração com uma API REST em ASP.NET Core.


## Funcionalidades Atuais

- Autenticação de utilizadores
  - Login via frontend
  - Registo disponível apenas via API (Swagger) para fins de desenvolvimento
- Criação e gestão de categorias
- Registo de movimentos financeiros
- Integração com Swagger para testes da API

> Nota: O projeto encontra-se em fase inicial de desenvolvimento e novas funcionalidades estão a ser adicionadas progressivamente.


## Tecnologias Utilizadas
- Angular
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger


## Como Executar o Projeto

### Backend
1. Criar uma base de dados local em SQL Server
2. Executar o script de criação das tabelas (`scriptCriaçãoTabelas.sql`)
3. Atualizar a `DefaultConnection` no ficheiro de configuração do backend com a ligação criada
4. Iniciar o backend
5. Aceder ao Swagger e efetuar o registo de um utilizador

### Frontend
6. Iniciar o frontend com:
   ng serve
