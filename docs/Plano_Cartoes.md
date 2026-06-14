# Plano Técnico: Sistema de Cartões

## 1. Objetivo

Adicionar ao Money Flow suporte a:

- cartões de débito
- cartões de crédito
- compras associadas a cartão
- faturas mensais de cartão de crédito
- pagamento de faturas sem corromper o saldo atual

O objetivo principal é encaixar esta funcionalidade no desenho atual do projeto sem misturar lógica de caixa com lógica de dívida.

## 2. Leitura do estado atual do projeto

### Backend

O backend atual está organizado de forma consistente:

- `Controllers -> Services -> UseCases -> DbContext`
- DTOs separados
- cálculo financeiro concentrado na API
- atualização incremental do saldo em `UserBalanceService`

Pontos centrais observados:

- `Transactions` representa hoje entradas e saídas de caixa
- `UserBalances.CurrentBalance` é atualizado imediatamente com base em cada transação
- `DashboardService` e `TransactionService` assumem que toda despesa impacta o saldo no momento do registo

### Frontend

O frontend também está consistente com o domínio atual:

- páginas separadas por área funcional
- tabela genérica reutilizável
- formulário de transações simples
- navegação preparada para crescer com novas áreas

### Estado técnico validado

- `dotnet build` com sucesso
- `npm run build -- --configuration development` com sucesso
- `dotnet test` com sucesso

Observação relevante:

- existe um aviso de vulnerabilidade no pacote `AutoMapper 12.0.1`

## 3. Limitação estrutural atual

Hoje o sistema trata toda despesa como movimento de caixa imediato.

Isso funciona para:

- dinheiro
- conta à ordem
- cartão de débito

Mas falha para cartão de crédito, porque uma compra em crédito:

- gera dívida
- entra numa fatura
- só afeta o saldo de caixa quando a fatura é paga

Se uma compra de crédito for gravada diretamente em `Transactions` como saída normal, o sistema passa a:

- reduzir o saldo cedo demais
- distorcer o dashboard de caixa
- perder a distinção entre despesa realizada e pagamento da dívida

## 4. Recomendação de arquitetura

### Decisão principal

Não recomendo estender apenas a tabela `Transactions` para suportar crédito.

Recomendo separar:

- movimentos de caixa
- movimentos de cartão
- faturas de cartão de crédito

### Razão

No modelo atual, `Transactions` é efetivamente um livro-caixa.

Cartão de crédito não é caixa. É um passivo temporário.

Se tudo for forçado para a mesma tabela, a regra de saldo, dashboard, edição e eliminação fica progressivamente inconsistente e difícil de manter.

## 5. Modelo de domínio recomendado

### 5.1. `Cards`

Nova entidade para representar um cartão do utilizador.

Campos sugeridos:

- `Id`
- `UserId`
- `Name`
- `CardType` (`Debit` | `Credit`)
- `Brand`
- `Last4Digits`
- `CreditLimit` nullable
- `ClosingDay` nullable
- `DueDay` nullable
- `IsActive`
- `CreatedAt`

Regras:

- cartão de débito não precisa de `ClosingDay` nem `DueDay`
- cartão de crédito deve exigir `ClosingDay` e `DueDay`

### 5.2. `CardTransactions`

Nova entidade para compras e movimentos feitos no cartão.

Campos sugeridos:

- `Id`
- `UserId`
- `CardId`
- `CategoryId` nullable
- `Description`
- `Amount`
- `TransactionDate`
- `CreatedAt`
- `InstallmentsCount`
- `InstallmentNumber`
- `InstallmentGroupId` nullable
- `SourceType` (`Purchase` | `Refund` | `Fee` | `Adjustment`)
- `CreditCardInvoiceId` nullable

Regras:

- cartão de débito: pode existir registo em `CardTransactions` para histórico do cartão
- cartão de crédito: o registo pertence ao cartão e à fatura respetiva

### 5.3. `CreditCardInvoices`

Nova entidade para faturas mensais de cartões de crédito.

Campos sugeridos:

- `Id`
- `UserId`
- `CardId`
- `ReferenceYear`
- `ReferenceMonth`
- `ClosingDate`
- `DueDate`
- `Status` (`Open` | `Closed` | `PartiallyPaid` | `Paid` | `Overdue`)
- `TotalAmount`
- `PaidAmount`
- `CreatedAt`
- `UpdatedAt`

Regras:

- uma compra de crédito pertence a uma fatura
- a fatura pode ser recalculada a partir dos movimentos
- o pagamento da fatura atualiza `PaidAmount`

### 5.4. `Transactions`

A tabela atual deve continuar a representar caixa real.

Novo papel recomendado:

- entradas normais
- saídas normais
- pagamentos de faturas
- eventualmente transferências futuras

Extensões opcionais úteis:

- `OriginType` (`Manual` | `DebitCardPayment` | `CreditCardInvoicePayment`)
- `RelatedCardId` nullable
- `RelatedInvoiceId` nullable

Isto permite rastreabilidade sem destruir o significado atual da tabela.

## 6. Regras funcionais recomendadas

### 6.1. Compra com cartão de débito

Fluxo:

1. criar `CardTransaction`
2. criar também `Transaction` de saída
3. atualizar `UserBalance`

Resultado:

- saldo desce imediatamente
- histórico do cartão fica preservado

### 6.2. Compra com cartão de crédito

Fluxo:

1. criar `CardTransaction`
2. associar à fatura correta
3. não mexer em `UserBalance`

Resultado:

- a compra entra na dívida
- o saldo de caixa não muda ainda

### 6.3. Pagamento de fatura de cartão de crédito

Fluxo:

1. selecionar fatura
2. registar pagamento total ou parcial
3. criar `Transaction` de saída
4. atualizar `UserBalance`
5. atualizar `CreditCardInvoices.PaidAmount` e `Status`

Resultado:

- o saldo só é impactado no momento do pagamento

### 6.4. Estornos

Recomendo suportar desde início:

- estorno de compra
- ajuste manual

Implementação:

- novo `CardTransaction` com valor negativo ou `SourceType = Refund`

### 6.5. Compras parceladas

Há duas opções.

#### Opção recomendada

Ao lançar uma compra parcelada:

- guardar um `InstallmentGroupId`
- gerar uma linha por prestação em `CardTransactions`
- cada prestação já entra na fatura correta

Vantagens:

- cálculo da fatura fica simples
- dashboard mensal fica coerente
- não é preciso motor adicional de projeção

#### Opção a evitar nesta fase

Guardar uma única compra e gerar parcelas apenas virtualmente.

Isso aumenta muito a complexidade do cálculo e da edição.

## 7. Alterações ao backend

### 7.1. Models

Adicionar:

- `Card`
- `CardTransaction`
- `CreditCardInvoice`

Atualizar:

- `User`
- `Category`
- `AppDbContext`
- opcionalmente `Transaction`

### 7.2. DTOs

Criar DTOs dedicados:

- `DTO_Card`
- `DTO_CardsPage`
- `DTO_CardTransaction`
- `DTO_CardTransactionsPage`
- `DTO_CreditCardInvoice`
- `DTO_CreditCardInvoicePayment`

### 7.3. Services

Criar novos serviços:

- `CardService`
- `CardTransactionService`
- `CreditCardInvoiceService`

Regras que devem sair de `TransactionService` atual:

- lógica de compras em cartão
- associação a fatura
- pagamento de fatura

### 7.4. Controllers

Adicionar novos controllers:

- `CardsController`
- `CardTransactionsController`
- `CreditCardInvoicesController`

### 7.5. Dashboard

`DashboardService` deve continuar a calcular caixa com base em `Transactions`, mas recomendo adicionar novos indicadores:

- total em aberto de cartões de crédito
- próxima fatura a vencer
- crédito disponível por cartão

Isto evita misturar liquidez com endividamento.

## 8. Alterações ao frontend

### 8.1. Novas páginas

Recomendo adicionar:

- `/cards`
- `/credit-cards/invoices`

Opcionalmente:

- `/cards/:id/transactions`

### 8.2. Reutilização de componentes existentes

O projeto já tem base para isto com:

- tabela genérica
- diálogo genérico
- select genérico

Ou seja, a UI pode crescer sem reescrever a infra.

### 8.3. Fluxos de UI recomendados

#### Gestão de cartões

- listar cartões
- criar cartão
- editar cartão
- ativar/desativar cartão

#### Registo de movimento em cartão

No formulário deve existir:

- tipo de cartão
- cartão selecionado
- categoria
- descrição
- valor
- data
- número de prestações, se crédito

#### Gestão de faturas

- listar faturas abertas, vencidas e pagas
- abrir detalhe de fatura
- pagar total
- pagar parcial

## 9. Fases de implementação recomendadas

### Fase 1

Base estrutural:

- tabelas novas
- models EF
- DTOs
- CRUD de cartões

### Fase 2

Cartões de débito:

- registo de compra em débito
- criação simultânea de `CardTransaction` e `Transaction`
- histórico de cartão

### Fase 3

Cartões de crédito sem prestações:

- compras em crédito
- geração/associação de faturas
- listagem de faturas
- pagamento total/parcial

### Fase 4

Parcelamentos:

- compra parcelada
- geração automática das prestações
- projeção em faturas futuras

### Fase 5

Dashboard avançada:

- indicadores de dívida
- vencimentos próximos
- limite disponível

## 10. Impacto nas regras atuais

### `UserBalanceService`

Deve continuar a mexer apenas em movimentos de caixa reais.

Isto significa:

- compra em débito: sim
- compra em crédito: não
- pagamento de fatura: sim

### `TransactionService`

Deve manter-se focado em transações de caixa.

Não recomendo torná-lo no serviço central de tudo, porque isso mistura responsabilidades.

## 11. Esquema SQL inicial sugerido

```sql
CREATE TABLE [dbo].[Cards] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [Name] NVARCHAR(100) NOT NULL,
    [CardType] NVARCHAR(20) NOT NULL,
    [Brand] NVARCHAR(50) NULL,
    [Last4Digits] NVARCHAR(4) NULL,
    [CreditLimit] DECIMAL(18,2) NULL,
    [ClosingDay] INT NULL,
    [DueDay] INT NULL,
    [IsActive] BIT NOT NULL CONSTRAINT DF_Cards_IsActive DEFAULT (1),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT DF_Cards_CreatedAt DEFAULT (SYSDATETIME()),
    CONSTRAINT FK_Cards_Users FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE
);

CREATE TABLE [dbo].[CreditCardInvoices] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [CardId] INT NOT NULL,
    [ReferenceYear] INT NOT NULL,
    [ReferenceMonth] INT NOT NULL,
    [ClosingDate] DATE NOT NULL,
    [DueDate] DATE NOT NULL,
    [Status] NVARCHAR(20) NOT NULL,
    [TotalAmount] DECIMAL(18,2) NOT NULL CONSTRAINT DF_CreditCardInvoices_TotalAmount DEFAULT (0),
    [PaidAmount] DECIMAL(18,2) NOT NULL CONSTRAINT DF_CreditCardInvoices_PaidAmount DEFAULT (0),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT DF_CreditCardInvoices_CreatedAt DEFAULT (SYSDATETIME()),
    [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT DF_CreditCardInvoices_UpdatedAt DEFAULT (SYSDATETIME()),
    CONSTRAINT FK_CreditCardInvoices_Users FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
    CONSTRAINT FK_CreditCardInvoices_Cards FOREIGN KEY ([CardId]) REFERENCES [dbo].[Cards]([Id]) ON DELETE CASCADE,
    CONSTRAINT UQ_CreditCardInvoices UNIQUE ([CardId], [ReferenceYear], [ReferenceMonth])
);

CREATE TABLE [dbo].[CardTransactions] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [CardId] INT NOT NULL,
    [CategoryId] INT NULL,
    [CreditCardInvoiceId] INT NULL,
    [Description] NVARCHAR(255) NULL,
    [Amount] DECIMAL(18,2) NOT NULL,
    [TransactionDate] DATE NOT NULL,
    [InstallmentsCount] INT NOT NULL CONSTRAINT DF_CardTransactions_InstallmentsCount DEFAULT (1),
    [InstallmentNumber] INT NOT NULL CONSTRAINT DF_CardTransactions_InstallmentNumber DEFAULT (1),
    [InstallmentGroupId] UNIQUEIDENTIFIER NULL,
    [SourceType] NVARCHAR(20) NOT NULL,
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT DF_CardTransactions_CreatedAt DEFAULT (SYSDATETIME()),
    CONSTRAINT FK_CardTransactions_Users FOREIGN KEY ([UserId]) REFERENCES [dbo].[Users]([Id]) ON DELETE CASCADE,
    CONSTRAINT FK_CardTransactions_Cards FOREIGN KEY ([CardId]) REFERENCES [dbo].[Cards]([Id]) ON DELETE CASCADE,
    CONSTRAINT FK_CardTransactions_Categories FOREIGN KEY ([CategoryId]) REFERENCES [dbo].[Categories]([Id]) ON DELETE SET NULL,
    CONSTRAINT FK_CardTransactions_CreditCardInvoices FOREIGN KEY ([CreditCardInvoiceId]) REFERENCES [dbo].[CreditCardInvoices]([Id]) ON DELETE SET NULL
);
```

## 12. Estratégia de implementação realista neste projeto

Se fosse eu a implementar na base atual, faria por esta ordem:

1. criar tabelas e modelos EF
2. criar CRUD de cartões
3. adicionar página `/cards`
4. implementar `CardTransactionService` para débito
5. implementar faturas de crédito
6. implementar pagamento de faturas
7. só depois adicionar prestações

Esta ordem reduz risco porque primeiro fecha o modelo, depois fecha caixa, e só depois entra na parte mais sensível de crédito.

## 13. Conclusão

O projeto atual tem base suficientemente limpa para receber esta evolução.

Mas a implementação correta exige uma separação explícita entre:

- movimentos de caixa
- movimentos de cartão
- dívida de cartão de crédito

Resumo da recomendação:

- manter `Transactions` como caixa real
- criar `Cards`
- criar `CardTransactions`
- criar `CreditCardInvoices`
- fazer o saldo mexer apenas em débito e pagamento de fatura

Esta é a forma mais segura de adicionar cartões sem degradar o domínio financeiro já existente.
