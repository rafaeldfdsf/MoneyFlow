using AutoMapper;
using MoneyFlowAPI.Application.Transactions;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly GetAllTransactionsUseCase _getAllTransactions;
        private readonly IMapper _mapper;

        public TransactionService(GetAllTransactionsUseCase getAllTransactions, IMapper mapper)
        {
            _getAllTransactions = getAllTransactions;
            _mapper = mapper;
        }

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
    }
}