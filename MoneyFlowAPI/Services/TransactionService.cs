using AutoMapper;
using MoneyFlowAPI.Application.Transactions;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly GetAllTransactionsUseCase _getAllTransactions;
        private readonly GetTransactionUseCase _getTransaction;
        private readonly CreateTransactionUseCase _createTransaction;
        private readonly DeleteTransactionUseCase _deleteTransactions;
        private readonly UpdateTransactionUseCase _updateTransaction;
        private readonly IMapper _mapper;

        public TransactionService(GetAllTransactionsUseCase getAllTransactions,
                                  GetTransactionUseCase getTransaction,
                                  CreateTransactionUseCase createTransaction,
                                  DeleteTransactionUseCase deleteTransaction,
                                  UpdateTransactionUseCase updateTransaction,
                                  IMapper mapper)
        {
            _getAllTransactions = getAllTransactions;
            _getTransaction = getTransaction;
            _createTransaction = createTransaction;
            _deleteTransactions = deleteTransaction;
            _updateTransaction = updateTransaction;
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
        public async Task<DTO_ResponseTable<DTO_Transactions>> UpdateTransactionAsync(DTO_Transactions dto)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Dados inválidos.");

                // Mapeia DTO -> Entidade
                Transaction entity = _mapper.Map<Transaction>(dto);

                // Executa comando/serviço de atualização
                Transaction? updated = await _updateTransaction.ExecuteAsync(entity);

                if (updated == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Falha ao atualizar transação.");

                // Mapeia Entidade -> DTO para retorno
                var updatedDto = _mapper.Map<DTO_Transactions>(updated);

                return DTO_ResponseTable<DTO_Transactions>.SuccessResult(
                    updatedDto,
                    "Transação atualizada com sucesso."
                );
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Transactions>.FailureResult(
                    $"Erro ao atualizar transação: {ex.Message}"
                );
            }
        }
        #endregion

        #region POST
        public async Task<DTO_ResponseTable<DTO_Transactions>> CreateTransactionAsync(DTO_Transactions dto, int userId)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Dados inválidos.");

                // Mapeia DTO -> Entidade (usando a entidade correta)
                Transaction entity = _mapper.Map<Transaction>(dto);

                // Executa comando/serviço de criação
                Transaction? created = await _createTransaction.ExecuteAsync(entity, userId);

                if (created == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Falha ao criar transação.");

                // Mapeia Entidade -> DTO para retorno
                var createdDto = _mapper.Map<DTO_Transactions>(created);

                return DTO_ResponseTable<DTO_Transactions>.SuccessResult(
                    createdDto,
                    "Transação criada com sucesso."
                );
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Transactions>.FailureResult(
                    $"Erro ao criar transação: {ex.Message}"
                );
            }
        }
        #endregion

        #region DELETE
        public async Task<DTO_ResponseTable<string>> DeleteTransactionsAsync(List<int> transactions)
        {
            try
            {
                if (transactions == null || !transactions.Any())
                    return DTO_ResponseTable<string>.FailureResult("Nenhuma transação para exclusão.");

                // Executa serviço/command responsável pela exclusão
                bool deleted = await _deleteTransactions.ExecuteAsync(transactions);

                if (!deleted)
                    return DTO_ResponseTable<string>.FailureResult("Falha ao excluir transações.");

                return DTO_ResponseTable<string>.SuccessResult(
                    "Transações removidas com sucesso."
                );
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<string>.FailureResult(
                    $"Erro ao excluir transações: {ex.Message}"
                );
            }
        }
        #endregion
    }
}