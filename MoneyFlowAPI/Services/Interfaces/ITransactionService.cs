using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface ITransactionService
    {
        #region GET
        Task<DTO_ResponseTable<List<DTO_Transactions>>> GetAllTransactionsAsync();
        Task<DTO_ResponseTable<DTO_Transactions>> GetTransactionAsync(int id);
        #endregion

        #region POST
        Task<DTO_ResponseTable<DTO_Transactions>> CreateTransactionAsync(DTO_Transactions transaction);
        #endregion

        #region DELETE
        Task<DTO_ResponseTable<string>> DeleteTransactionsAsync(List<int> transactions);
        #endregion
    }
}
