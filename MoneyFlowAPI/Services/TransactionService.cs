using AutoMapper;
using MoneyFlowAPI.Application.Transactions;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;
using System.Transactions;

namespace MoneyFlowAPI.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly GetAllTransactionsUseCase _getAllTransactions;
        private readonly CreateTransactionUseCase _createTransaction;
        private readonly IMapper _mapper;

        public TransactionService(GetAllTransactionsUseCase getAllTransactions, CreateTransactionUseCase createTransaction, IMapper mapper)
        {
            _getAllTransactions = getAllTransactions;
            _createTransaction = createTransaction;
            _mapper = mapper;
        }

        #region GET
        public async Task<DTO_ResponseTable<List<DTO_Transactions>>> GetAllTransactionsAsync()
        {
            try
            {
                var transactions = await _getAllTransactions.ExecuteAsync();

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
        #endregion

        #region POST
        public async Task<DTO_ResponseTable<DTO_Transactions>> CreateTransactionAsync(DTO_Transactions dto)
        {
            try
            {
                if (dto == null)
                    return DTO_ResponseTable<DTO_Transactions>.FailureResult("Dados inválidos.");

                // Mapeia DTO -> Entidade (usando a entidade correta)
                Models.Transaction entity = _mapper.Map<Models.Transaction>(dto);

                // Executa comando/serviço de criação
                Models.Transaction? created = await _createTransaction.ExecuteAsync(entity);

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
    }
}