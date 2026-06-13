# Manual Técnico

## 1. Objetivo deste manual

Este manual explica a estrutura do projeto, a organização do código, os padrões usados e o fluxo normal de trabalho para que qualquer pessoa consiga entrar no projeto e continuar o desenvolvimento.

## 2. Visão geral da solução

A solução está organizada em vários projetos:

- `MoneyFlowAPI`
- `MoneyFlowUI`
- `MoneyFlowShared`
- `MoneyFlowTests`

### 2.1. `MoneyFlowAPI`

Backend em **ASP.NET Core Web API**.

Responsável por:

- autenticação
- regras de negócio
- acesso à base de dados
- agregação de indicadores
- exposição de endpoints REST

### 2.2. `MoneyFlowUI`

Frontend em **Angular**.

Responsável por:

- navegação
- formulários
- rendering de tabelas e dashboard
- feedback visual ao utilizador
- consumo da API

### 2.3. `MoneyFlowShared`

Projeto partilhado da solução .NET.

Neste momento o seu papel é reduzido, mas pode servir para:

- utilitários comuns
- modelos partilhados
- abstrações reutilizáveis no ecossistema .NET da solução

### 2.4. `MoneyFlowTests`

Projeto de testes automatizados.

Atualmente:

- existe a infraestrutura do projeto
- a cobertura real ainda é mínima

Isto deve ser tratado como dívida técnica conhecida.

## 3. Estrutura do repositório

### Raiz

- [README.md](/C:/Work/MoneyFlow/README.md)
- [scriptCriaçãoTabelas.sql](/C:/Work/MoneyFlow/scriptCriaçãoTabelas.sql)
- [Dockerfile](/C:/Work/MoneyFlow/Dockerfile)
- [docs/Manual_Funcional.md](/C:/Work/MoneyFlow/docs/Manual_Funcional.md)
- [docs/Manual_Tecnico.md](/C:/Work/MoneyFlow/docs/Manual_Tecnico.md)

### Backend

Pasta principal: `C:\Work\MoneyFlow\MoneyFlowAPI`

Pastas mais importantes:

- `Application`
- `Controllers`
- `Mappings`
- `Models`
- `Services`

### Frontend

Pasta principal: `C:\Work\MoneyFlow\MoneyFlowUI`

Pastas mais importantes:

- `src`
- `src/app`
- `src/app/pages`
- `src/app/services`
- `src/app/shared`
- `src/app/layout`

## 4. Como correr o projeto

### 4.1. Requisitos

- .NET SDK
- Node.js + npm
- SQL Server
- certificado HTTPS de desenvolvimento do .NET confiado na máquina

### 4.2. Base de dados

Criar a base de dados local e executar:

- [scriptCriaçãoTabelas.sql](/C:/Work/MoneyFlow/scriptCriaçãoTabelas.sql)

Depois disso, ajustar a `DefaultConnection` em:

- [appsettings.json](/C:/Work/MoneyFlow/MoneyFlowAPI/appsettings.json)
- [appsettings.Development.json](/C:/Work/MoneyFlow/MoneyFlowAPI/appsettings.Development.json)

### 4.3. Arranque do backend

Na pasta `MoneyFlowAPI`:

```powershell
dotnet restore
dotnet build
dotnet run
```

Portas locais definidas em:

- [launchSettings.json](/C:/Work/MoneyFlow/MoneyFlowAPI/Properties/launchSettings.json)

Atualmente:

- `https://localhost:7085`
- `http://localhost:5039`

### 4.4. Arranque do frontend

Na pasta `MoneyFlowUI`:

```powershell
npm install
npm start
```

Ou:

```powershell
ng serve
```

### 4.5. Ambientes do frontend

Os ambientes estão em:

- [environment.development.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/environment.development.ts)
- [environment.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/environment.ts)

Atualmente:

- desenvolvimento aponta para `https://localhost:7085/api`
- produção aponta para a API Azure

## 5. Arquitetura do backend

### 5.1. Ponto de entrada

O arranque do backend acontece em:

- [Program.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Program.cs)

Aqui são configurados:

- controllers
- Swagger
- `DbContext`
- `AutoMapper`
- JWT
- CORS
- DI dos serviços e casos de uso

### 5.2. Controllers

Os controllers expõem os endpoints HTTP e delegam a lógica para serviços.

Controllers atuais:

- [AuthController.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Controllers/AuthController.cs)
- [DashboardController.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Controllers/DashboardController.cs)
- [CategoryController.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Controllers/CategoryController.cs)
- [TransactionsController.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Controllers/TransactionsController.cs)
- [UserBalanceController.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Controllers/UserBalanceController.cs)
- [UsersController.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Controllers/UsersController.cs)

`BaseController` centraliza o acesso ao `UserId` do utilizador autenticado.

### 5.3. Services

Os serviços são a principal camada de regra de negócio.

Serviços atuais:

- [AuthService.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Services/AuthService.cs)
- [DashboardService.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Services/DashboardService.cs)
- [CategoryService.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Services/CategoryService.cs)
- [TransactionService.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Services/TransactionService.cs)
- [UserBalanceService.cs](/C:/Work/MoneyFlow/MoneyFlowAPI/Services/UserBalanceService.cs)

Regra importante do projeto:

- a lógica de negócio deve viver aqui, não no Angular

Exemplos já aplicados:

- dashboard calculada no backend
- indicadores da página de categorias calculados no backend
- indicadores da página de movimentos calculados no backend
- atualização automática de saldo tratada no backend

### 5.4. Application

A pasta `Application` contém:

- DTOs
- casos de uso para categorias
- casos de uso para transações

Isto cria uma separação razoável entre:

- contrato externo
- fluxo de aplicação
- camada de dados

### 5.5. DTOs

Os DTOs seguem a convenção:

- `DTO_xxx`

Exemplos:

- `DTO_Transactions`
- `DTO_TransactionsPage`
- `DTO_Category`
- `DTO_CategoriesPage`
- `DTO_Dashboard`
- `DTO_ResponseTable<T>`

Regra prática importante:

- se um objeto existe só para transporte, deve usar o prefixo `DTO_`
- se não há transformação útil intermédia, não faz sentido inventar um DTO só para passar no `AutoMapper`

### 5.6. Mappings

Os mappings de `AutoMapper` estão em:

- `Mappings/CategoryProfile.cs`
- `Mappings/TransactionProfile.cs`
- `Mappings/UserBalanceProfile.cs`

Uso recomendado:

- mapear entidade para DTO
- mapear DTO para entidade
- evitar `AutoMapper` quando a transformação é trivial e só adiciona complexidade

### 5.7. Models

Os modelos de base de dados estão em:

- `Models/AppDbContext.cs`
- entidades como `User`, `Transaction`, `Category`, `UserBalance`

O `AppDbContext` é a referência principal para:

- relações
- chaves
- comportamento de delete
- configuração EF Core

## 6. Arquitetura do frontend

### 6.1. Rotas

Rotas principais:

- [src/app.routes.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app.routes.ts)
- [auth.routes.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/pages/auth/auth.routes.ts)
- [transactions.routes.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/pages/transactions/transactions.routes.ts)
- [categories.routes.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/pages/categories/categories.routes.ts)

Organização atual:

- `/auth/*` para autenticação
- `/` para dashboard
- `/transactions` para movimentos
- `/categories` para categorias

### 6.2. Guardas

O acesso às páginas internas é protegido por:

- [auth-guard.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/guards/auth-guard.ts)

O `authGuard` usa `AuthService.isAuthenticated()` e redireciona para `/auth/login` quando necessário.

### 6.3. Pages

Cada área funcional está em `src/app/pages`.

Exemplos:

- dashboard
- auth
- transactions
- categories

Padrão seguido hoje:

- `nome.component.ts`
- `nome.component.html`
- `nome.component.scss` quando necessário

### 6.4. Services do Angular

Os services do frontend fazem a ponte com a API:

- [auth.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/services/auth.service.ts)
- [Transactions.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/services/Transactions.service.ts)
- [Categories.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/services/Categories.service.ts)
- [Dashboard.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/services/Dashboard.service.ts)
- [UserBalance.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/services/UserBalance.service.ts)
- [base-http.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/services/base-http.service.ts)

`BaseHttpService` centraliza o unwrap do `DTO_ResponseTable<T>`.

### 6.5. Shared components

O projeto já tem componentes reutilizáveis importantes:

- [generic-table](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/shared/components/generic-table/generic-table.ts)
- [generic-dialog](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/shared/components/generic-dialog/generic-dialog.component.ts)
- [generic-select](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/shared/components/generic-select/generic-select.component.ts)

Função de cada um:

- `generic-table`: tabela reutilizável com paginação, pesquisa, seleção e templates
- `generic-dialog`: wrapper para diálogos PrimeNG
- `generic-select`: select ligado a endpoints simples para popular opções

### 6.6. Estado no Angular

O frontend usa `signal()` e `computed()` para estado local de UI.

Regra que está a ser consolidada no projeto:

- estado visual no Angular
- regra de negócio no backend

Exemplos de estado aceitável no frontend:

- loading
- item selecionado
- diálogo aberto/fechado
- mensagens de erro visuais

Exemplos a evitar no frontend:

- cálculos de métricas financeiras
- regras mensais
- agregações de negócio repetidas

### 6.7. Tema e layout

O layout principal vive em:

- [app.layout](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/layout/component/app.layout.ts)
- [layout.service.ts](/C:/Work/MoneyFlow/MoneyFlowUI/src/app/layout/service/layout.service.ts)

Configuração atual por defeito:

- `darkTheme: true`
- `primary: 'blue'`
- `surface: 'zinc'`

## 7. Fluxo de dados

Exemplo típico de fluxo:

1. o utilizador interage com um formulário Angular
2. o componente chama um service Angular
3. o service chama um endpoint da API
4. o controller delega para um service do backend
5. o service aplica regras de negócio
6. a resposta volta em `DTO_ResponseTable<T>`
7. o Angular renderiza o resultado

## 8. Convenções atuais do projeto

### 8.1. Convenção de nomes

- DTOs com prefixo `DTO_`
- componentes Angular com sufixo `.component`
- services por domínio funcional
- rotas lazy-loaded por área

### 8.2. Regras práticas

- evitar lógica de negócio no Angular
- preferir centralizar cálculos na API
- reutilizar componentes shared antes de criar novos
- usar `AutoMapper` quando há transformação útil real
- evitar `AutoMapper` quando a construção manual é mais clara

### 8.3. Idioma e escrita

O projeto está a ser mantido em português de Portugal.

Isto inclui:

- labels
- mensagens
- comentários
- documentação

## 9. Como adicionar uma nova funcionalidade

Fluxo recomendado:

1. definir o caso de uso funcional
2. criar ou ajustar DTOs no backend
3. implementar a regra no service adequado
4. expor endpoint no controller
5. ajustar o service Angular
6. construir ou adaptar a page/component
7. validar com build e testes manuais

Exemplo típico:

- nova métrica financeira
  - calcular na API
  - devolver num DTO
  - apenas renderizar no Angular

## 10. Como adicionar uma nova página

No frontend:

1. criar pasta em `src/app/pages`
2. criar componente `.ts` e `.html`
3. criar rota da área
4. ligar a `app.routes.ts` ou à rota lazy correspondente
5. criar service se precisar de API

No backend, se aplicável:

1. criar DTOs
2. criar ou adaptar service
3. criar ou adaptar controller
4. registar dependências em `Program.cs`

## 11. Como testar e validar alterações

### Backend

```powershell
dotnet build
```

### Frontend

```powershell
npm run build -- --configuration development
```

### Testes .NET

```powershell
dotnet test
```

### Testes Angular

```powershell
npm test
```

Nota importante:

- neste momento a base de testes existe, mas a cobertura funcional real ainda é muito limitada

## 12. Pontos de atenção para quem pegar no projeto

### 12.1. Reinícios necessários

Quando se alteram:

- DTOs da API
- endpoints
- `angular.json`
- configurações de ambiente

é importante reiniciar os processos locais correspondentes.

### 12.2. Certificados HTTPS locais

Se o frontend não conseguir falar com `https://localhost:7085`, pode ser necessário:

```powershell
dotnet dev-certs https --trust
```

### 12.3. Dados de build

As pastas `bin/`, `obj/`, `dist/` e afins são artefactos gerados e não devem ser tratadas como código de negócio.

### 12.4. Contratos API/UI

Sempre que se muda um DTO no backend, confirmar:

- controller
- service Angular
- componente Angular

porque uma incompatibilidade de contrato pode deixar páginas vazias sem erro visual óbvio.

## 13. Estado atual do projeto

O projeto já tem uma base funcional sólida:

- autenticação
- dashboard
- categorias
- movimentos
- saldo automático
- criação inline de categoria no formulário de movimento

Mas ainda há trabalho natural de continuidade em:

- testes automáticos
- documentação viva de endpoints
- endurecimento de validações
- mais funcionalidades de negócio

## 14. Resumo para onboarding rápido

Se uma pessoa entrar hoje no projeto, o caminho mais rápido é:

1. ler este manual
2. correr backend e frontend
3. abrir Swagger
4. testar login, dashboard, categorias e movimentos
5. seguir a estrutura `Controller -> Service -> DTO -> Angular Service -> Page`

Essa cadeia descreve praticamente todo o funcionamento atual do Money Flow.

