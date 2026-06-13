# Money Flow

Aplicação web **full stack** de gestão financeira pessoal, com:

- **frontend** em Angular
- **backend** em ASP.NET Core Web API
- **base de dados** em SQL Server

## Documentação principal

- [Manual Funcional](./docs/Manual_Funcional.md)
- [Manual Técnico](./docs/Manual_Tecnico.md)

## Arranque rápido

### Backend

1. Criar a base de dados local em SQL Server
2. Executar o script [scriptCriaçãoTabelas.sql](./scriptCriaçãoTabelas.sql)
3. Ajustar a `DefaultConnection` no backend
4. Arrancar a API:

```powershell
cd .\MoneyFlowAPI
dotnet restore
dotnet build
dotnet run
```

### Frontend

```powershell
cd .\MoneyFlowUI
npm install
npm start
```

## Tecnologias

- Angular 21
- PrimeNG
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger
- JWT
