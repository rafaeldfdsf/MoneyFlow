using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Application.Transactions;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;
using System.Data.Common;

namespace MoneyFlowAPI.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly GetAllTransactionsUseCase _getAllTransactions;
        private readonly GetTransactionUseCase _getTransaction;
        private readonly CreateTransactionUseCase _createTransaction;
        private readonly DeleteTransactionUseCase _deleteTransactions;
        private readonly UpdateTransactionUseCase _updateTransaction;
        private readonly IUserBalanceService _userBalanceService;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TransactionService(GetAllTransactionsUseCase getAllTransactions,
                                  GetTransactionUseCase getTransaction,
                                  CreateTransactionUseCase createTransaction,
                                  DeleteTransactionUseCase deleteTransaction,
                                  UpdateTransactionUseCase updateTransaction,
                                  IUserBalanceService userBalanceService,
                                  AppDbContext context,
                                  IMapper mapper)
        {
            _getAllTransactions = getAllTransactions;
            _getTransaction = getTransaction;
            _createTransaction = createTransaction;
            _deleteTransactions = deleteTransaction;
            _updateTransaction = updateTransaction;
            _userBalanceService = userBalanceService;
            _context = context;
            _mapper = mapper;
        }

        #region GET
        public async Task<DTO_ResponseTable<List<DTO_Transactions>>> GetAllTransactionsAsync(int userId)
        {
            try
            {
                var transactions = await _getAllTransactions.ExecuteAsync(userId);

                if (transactions == null || !transactions.Any())
                    return DTO_ResponseTable<List<DTO_Transactions>>.FailureResult("Nenhuma transação encontrada.");

                var dtoList = _mapper.Map<List<DTO_Transactions>>(transactions);

                return DTO_ResponseTable<List<DTO_Transactions>>.SuccessResult(dtoList);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<List<DTO_Transactions>>.FailureResult($"Erro ao obter transações: {ex.Message}"); 
            }
        }

        public async Task<DTO_ResponseTable<DTO_Transactions>> GetTransactionAsync(int id)
        {
            try
            {
                Transaction? transaction = await _getTransaction.ExecuteAsync(id);

                if (transaction == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Nenhuma transação encontrada.");

                var dtoList = _mapper.Map<DTO_Transactions>(transaction);

                return DTO_ResponseTable<DTO_Transactions>.SuccessResult(dtoList);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Transactions>.FailureResult($"Erro ao obter transações: {ex.Message}");
            }
        }
        #endregion

        #region PUT
        public async Task<DTO_ResponseTable<DTO_Transactions>> UpdateTransactionAsync(DTO_Transactions dto, int userId)
        {
            if (dto == null)
                return DTO_ResponseTable<DTO_Transactions>.FailureResult("Dados inválidos.");

            // Inicia transação de base de dados
            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Vai buscar a transação atual da BD (estado ANTES do update)
                var existingTransaction = await _context.Transactions
                    .SingleOrDefaultAsync(t => t.Id == dto.Id && t.UserId == userId);

                if (existingTransaction == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Transação não encontrada.");

                // Guarda snapshot dos campos que afetam o saldo
                var oldTransaction = new Transaction
                {
                    Amount = existingTransaction.Amount,
                    IsIncome = existingTransaction.IsIncome
                };

                // Aplica alterações do DTO na entidade EXISTENTE
                _mapper.Map(dto, existingTransaction);

                //// Atualiza saldo do utilizador após a criação da transação
                //await _userBalanceService.UpdateUserBalanceAsync(userId, existingTransaction, oldTransaction);

                //// Mapeia DTO -> Entidade
                //Transaction entity = _mapper.Map<Transaction>(dto);

                //// Executa comando/serviço de atualização
                //Transaction? updated = await _updateTransaction.ExecuteAsync(entity);

                //if (updated == null)
                //    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Falha ao atualizar transação.");

                // Guarda as alterações na Base de Dados
                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();

                // Mapeia Entidade -> DTO para retorno
                var updatedDto = _mapper.Map<DTO_Transactions>(existingTransaction); 

                return DTO_ResponseTable<DTO_Transactions>.SuccessResult(
                    updatedDto,
                    "Transação atualizada com sucesso."
                );
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                return DTO_ResponseTable<DTO_Transactions>.FailureResult($"Erro ao atualizar transação: {ex.Message}");
            }
        }
        #endregion

        #region POST
        public async Task<DTO_ResponseTable<DTO_Transactions>> CreateTransactionAsync(DTO_Transactions dto, int userId)
        {
            if (dto == null)
                return DTO_ResponseTable<DTO_Transactions>.FailureResult("Dados inválidos.");

            // Inicia transação de base de dados
            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Mapeia DTO -> Entidade (usando a entidade correta)
                Transaction entity = _mapper.Map<Transaction>(dto);

                // Executa comando/serviço de criação
                Transaction? created = await _createTransaction.ExecuteAsync(entity, userId);
                if (created == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Falha ao criar transação.");

                // Atualiza saldo do utilizador após a criação da transação
                await _userBalanceService.UpdateUserBalanceAsync(userId, created);

                // Guarda as alterações na Base de Dados
                await _context.SaveChangesAsync();
                await dbTransaction.CommitAsync();

                // Mapeia Entidade -> DTO para retorno
                var createdDto = _mapper.Map<DTO_Transactions>(created);

                return DTO_ResponseTable<DTO_Transactions>.SuccessResult(
                    createdDto,
                    "Transação criada com sucesso."
                );
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                return DTO_ResponseTable<DTO_Transactions>.FailureResult($"Erro ao criar transação: {ex.Message}");
            }
        }
        #endregion

        #region DELETE
        public async Task<DTO_ResponseTable<string>> DeleteTransactionsAsync(List<int> transactionsIds, int userId)
        {
            // Inicia transação de base de dados
            using var dbTransaction = await _context.Database.BeginTransactionAsync();

            try
            {
                if (transactionsIds == null || !transactionsIds.Any())
                    return DTO_ResponseTable<string>.FailureResult("Nenhuma transação para exclusão.");

                List<Transaction> transactions = await _context.Transactions
                    .Where(t => transactionsIds.Contains(t.Id))
                    .ToListAsync();

                if (!transactions.Any())
                    return DTO_ResponseTable<string>.FailureResult("Transações não encontradas.");

                // Atualiza saldo do utilizador
                foreach (Transaction transaction in transactions)
                {
                    await _userBalanceService.UpdateUserBalanceAsync(userId, transaction, isDelete: true);
                }

                // Remove as transações já carregadas
                _context.Transactions.RemoveRange(transactions);

                // Guarda as alterações na Base de Dados
                await _context.SaveChangesAsync();

                // Confirma a transação
                await dbTransaction.CommitAsync();

                return DTO_ResponseTable<string>.SuccessResult("Transações removidas com sucesso.");
            }
            catch (Exception ex)
            {
                await dbTransaction.RollbackAsync();
                return DTO_ResponseTable<string>.FailureResult($"Erro ao excluir transações: {ex.Message}");
            }
        }
        #endregion
    }
}