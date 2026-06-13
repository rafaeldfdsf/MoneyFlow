# Manual Funcional

## 1. Objetivo da aplicação

O **Money Flow** é uma aplicação web de gestão financeira pessoal. Permite registar receitas e despesas, organizar os movimentos por categorias e consultar um resumo financeiro mensal numa dashboard.

O projeto está dividido em:

- **Frontend** em Angular
- **Backend** em ASP.NET Core Web API
- **Base de dados** em SQL Server

## 2. O que a aplicação consegue fazer

### 2.1. Autenticação

A aplicação suporta autenticação de utilizadores através de:

- **Registo**
- **Login**
- **Logout**

Depois de iniciar sessão, o utilizador passa a aceder às páginas protegidas da aplicação. O token JWT fica guardado no `localStorage` e o acesso é controlado pelo `authGuard`.

### 2.2. Dashboard financeira

A dashboard apresenta indicadores reais gerados no backend com base nos movimentos do utilizador autenticado.

Atualmente mostra:

- **Saldo atual**
- **Receitas do mês**
- **Despesas do mês**
- **Poupança líquida**
- **Top categorias** com maior peso nas despesas do mês
- **Número de movimentos do mês**
- **Taxa de poupança**
- **Último movimento registado**
- **Período analisado**

### 2.3. Gestão de categorias

Na página de categorias, o utilizador consegue:

- listar categorias
- criar uma categoria
- editar uma categoria existente
- eliminar uma ou várias categorias
- consultar indicadores rápidos da página:
  - total de categorias
  - categorias criadas no mês atual
  - número de categorias selecionadas
  - última categoria criada

Também existe um endpoint específico para popular selects com categorias em formato simples (`value` / `label`).

### 2.4. Gestão de movimentos / transações

Na página de movimentos, o utilizador consegue:

- listar movimentos
- criar um movimento
- editar um movimento existente
- eliminar um ou vários movimentos
- selecionar várias linhas para ações em lote
- pesquisar por descrição ou tipo
- consultar indicadores rápidos da página:
  - saldo atual
  - receitas do mês
  - despesas do mês
  - fluxo líquido do mês
  - número total de registos
  - número de movimentos do mês

Cada movimento inclui:

- descrição
- valor
- categoria
- tipo (`Entrada` ou `Saída`)
- data do movimento

### 2.5. Criação rápida de categoria no formulário de movimento

Ao criar ou editar um movimento, o utilizador não precisa de sair para a página de categorias se faltar uma categoria.

No formulário de movimento existe a ação:

- **Adicionar categoria**

Esse fluxo permite:

- abrir um pequeno bloco inline no próprio formulário
- criar uma categoria nova
- recarregar o select de categorias
- selecionar automaticamente a categoria acabada de criar

### 2.6. Gestão automática do saldo

O saldo do utilizador é atualizado automaticamente quando:

- é criado um movimento
- é editado um movimento
- é eliminado um movimento

Isto significa que o utilizador não precisa de recalcular o saldo manualmente.

## 3. Páginas da aplicação

### 3.1. `/auth/login`

Página de autenticação.

Permite:

- introduzir email e password
- iniciar sessão
- navegar para o registo

### 3.2. `/auth/register`

Página de criação de conta.

Permite:

- introduzir nome
- introduzir email
- definir password
- confirmar password

### 3.3. `/`

Dashboard principal da aplicação.

É a página inicial após login.

### 3.4. `/transactions`

Página de gestão de movimentos.

Permite:

- consultar movimentos existentes
- criar movimentos
- editar movimentos
- eliminar movimentos

### 3.5. `/categories`

Página de gestão de categorias.

Permite:

- consultar categorias
- criar categorias
- editar categorias
- eliminar categorias

## 4. Experiência visual e comportamento

A aplicação está configurada para abrir por predefinição com:

- **modo dark**
- **cor principal blue**

Outros pontos relevantes:

- layout responsivo
- páginas otimizadas para desktop e telemóvel
- componentes reutilizáveis para tabela, diálogo e select
- toasts de feedback para sucesso e erro
- formulários com validação visual

## 5. Regras funcionais principais

### 5.1. Segurança

- as páginas internas exigem autenticação
- o backend identifica o utilizador através do JWT
- os dados devolvidos são filtrados por utilizador autenticado

### 5.2. Categorias

- uma categoria pode ser usada por movimentos
- as categorias servem para organizar e classificar despesas e receitas

### 5.3. Movimentos

- um movimento pode ser `Entrada` ou `Saída`
- o valor do movimento impacta o saldo
- a data do movimento é relevante para os cálculos mensais

### 5.4. Indicadores mensais

Os indicadores apresentados na dashboard, nas categorias e nos movimentos são calculados no backend, não no Angular.

Isto garante:

- consistência de regra de negócio
- menos lógica espalhada pela UI
- mais facilidade para manter e testar o projeto

## 6. Endpoints principais da API

### Autenticação

- `POST /api/Auth/register`
- `POST /api/Auth/login`

### Dashboard

- `GET /api/Dashboard/dashboard`

### Categorias

- `GET /api/Category/categories`
- `GET /api/Category/category/{id}`
- `GET /api/Category/select`
- `POST /api/Category/category`
- `PUT /api/Category/category`
- `POST /api/Category/categories`

### Movimentos

- `GET /api/Transactions/transactions`
- `GET /api/Transactions/transaction/{id}`
- `POST /api/Transactions/transaction`
- `PUT /api/Transactions/transaction`
- `POST /api/Transactions/transactions`

### Saldo do utilizador

- `GET /api/UserBalance/userBalance`

## 7. Limitações atuais

O projeto já é utilizável, mas ainda tem espaço para evolução. Alguns pontos atuais:

- a pasta de testes existe, mas a suite automática ainda está praticamente vazia
- a aplicação está focada em gestão financeira individual
- não existem ainda funcionalidades como exportação, orçamentos, recorrências ou anexos

## 8. Resumo

Hoje o Money Flow permite:

- autenticar utilizadores
- registar receitas e despesas
- gerir categorias
- consultar uma dashboard financeira real
- criar categorias diretamente a partir do formulário de movimento
- manter o saldo do utilizador sempre coerente com os movimentos

É uma base sólida para continuar a evoluir a aplicação para cenários mais completos de finanças pessoais.

