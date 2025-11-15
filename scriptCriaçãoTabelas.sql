--dotnet ef dbcontext scaffold "Server=localhost;Database=MoneyFlowDB;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -o Models -c AppDbContext --force

USE MoneyFlowDB;
GO

-- ==========================================
-- Tabela de Utilizadores
-- ==========================================
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Email NVARCHAR(150) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL
);

-- ==========================================
-- Tabela de Categorias
-- ==========================================
CREATE TABLE [dbo].[Categories] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [Name] NVARCHAR(100) NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Categories_Users FOREIGN KEY ([UserId])
        REFERENCES [dbo].[Users]([Id])
        ON DELETE NO ACTION
);

-- ==========================================
-- Tabela de Entradas e Saídas (Transações)
-- ==========================================
CREATE TABLE [dbo].[Transactions] (
    [Id] INT IDENTITY(1,1) PRIMARY KEY,
    [UserId] INT NOT NULL,
    [CategoryId] INT NULL,
    [IsIncome] BIT NOT NULL,           -- 1 = entrada, 0 = saída
    [Amount] DECIMAL(10,2) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    [TransactionDate] DATE NOT NULL,
    [CreatedAt] DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Transactions_Users FOREIGN KEY ([UserId])
        REFERENCES [dbo].[Users]([Id])
        ON DELETE CASCADE,

    CONSTRAINT FK_Transactions_Categories FOREIGN KEY ([CategoryId])
        REFERENCES [dbo].[Categories]([Id])
        ON DELETE SET NULL
);
