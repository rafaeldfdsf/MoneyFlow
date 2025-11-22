using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface ITransactionService
    {
        Task<DTO_ResponseTable<List<DTO_Transactions>>> GetAllTransactionsAsync();
    }
}
