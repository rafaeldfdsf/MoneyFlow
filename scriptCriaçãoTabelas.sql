-- dotnet ef dbcontext scaffold "Server=localhost;Database=MoneyFlowDB;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -o Models -c AppDbContext --force

IF DB_ID(N'MoneyFlowDB') IS NULL
BEGIN
    CREATE DATABASE [MoneyFlowDB];
END;
GO

USE [MoneyFlowDB];
GO

SET NOCOUNT ON;
GO

-- ==========================================
-- Tabela de Utilizadores
-- ==========================================
IF OBJECT_ID(N'[dbo].[Users]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Users] ( 
        [Id] INT IDENTITY(1,1) NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [Email] NVARCHAR(150) NOT NULL,
        [PasswordHash] NVARCHAR(255) NOT NULL,

        CONSTRAINT [PK_Users] PRIMARY KEY ([Id]),
        CONSTRAINT [UQ_Users_Email] UNIQUE ([Email])
    );
END;
GO

-- ==========================================
-- Tabela de Cartões
-- ==========================================
IF OBJECT_ID(N'[dbo].[Cards]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Cards] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [UserId] INT NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [CardType] NVARCHAR(20) NOT NULL,   -- Debit | Credit
        [Brand] NVARCHAR(50) NULL,
        [Last4Digits] NVARCHAR(4) NULL,
        [CreditLimit] DECIMAL(18,2) NULL,
        [ClosingDay] INT NULL,
        [DueDay] INT NULL,
        [IsActive] BIT NOT NULL CONSTRAINT [DF_Cards_IsActive] DEFAULT (1),
        [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_Cards_CreatedAt] DEFAULT (SYSDATETIME()),

        CONSTRAINT [PK_Cards] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Cards_Users]
            FOREIGN KEY ([UserId])
            REFERENCES [dbo].[Users]([Id])
            ON DELETE CASCADE
    );
END;
GO

-- ==========================================
-- Tabela de Categorias
-- ==========================================
IF OBJECT_ID(N'[dbo].[Categories]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Categories] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [UserId] INT NOT NULL,
        [Name] NVARCHAR(100) NOT NULL,
        [CreatedAt] DATETIME NOT NULL CONSTRAINT [DF_Categories_CreatedAt] DEFAULT (GETDATE()),

        CONSTRAINT [PK_Categories] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Categories_Users]
            FOREIGN KEY ([UserId])
            REFERENCES [dbo].[Users]([Id])
            ON DELETE NO ACTION
    );
END;
GO

-- ==========================================
-- Tabela de Entradas e Saídas (Transações)
-- ==========================================
IF OBJECT_ID(N'[dbo].[Transactions]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Transactions] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [UserId] INT NOT NULL,
        [CategoryId] INT NULL,
        [IsIncome] BIT NOT NULL,           -- 1 = entrada, 0 = saída
        [Amount] DECIMAL(10,2) NOT NULL,
        [Description] NVARCHAR(255) NULL,
        [TransactionDate] DATE NOT NULL,
        [CreatedAt] DATETIME NOT NULL CONSTRAINT [DF_Transactions_CreatedAt] DEFAULT (GETDATE()),

        CONSTRAINT [PK_Transactions] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Transactions_Users]
            FOREIGN KEY ([UserId])
            REFERENCES [dbo].[Users]([Id])
            ON DELETE CASCADE,
        CONSTRAINT [FK_Transactions_Categories]
            FOREIGN KEY ([CategoryId])
            REFERENCES [dbo].[Categories]([Id])
            ON DELETE SET NULL
    );
END;
GO

-- ====================================================================================================
-- Tabela responsável por armazenar e manter o saldo financeiro atual de cada utilizador.
-- ====================================================================================================
IF OBJECT_ID(N'[dbo].[UserBalances]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[UserBalances] (
        [Id] INT IDENTITY(1,1) NOT NULL,
        [UserId] INT NOT NULL,
        [CurrentBalance] DECIMAL(18,2) NOT NULL CONSTRAINT [DF_UserBalances_CurrentBalance] DEFAULT (0),
        [UpdatedAt] DATETIME2 NOT NULL CONSTRAINT [DF_UserBalances_UpdatedAt] DEFAULT (SYSDATETIME()),

        CONSTRAINT [PK_UserBalances] PRIMARY KEY ([Id]),
        CONSTRAINT [UQ_UserBalances_User] UNIQUE ([UserId]),
        CONSTRAINT [FK_UserBalances_Users]
            FOREIGN KEY ([UserId])
            REFERENCES [dbo].[Users]([Id])
            ON DELETE CASCADE
    );
END;
GO
