using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface ITransactionService
    {
        #region GET
        Task<DTO_ResponseTable<List<DTO_Transactions>>> GetAllTransactionsAsync();
        #endregion

        #region POST
        Task<DTO_ResponseTable<DTO_Transactions>> CreateTransactionAsync(DTO_Transactions transaction);
        #endregion
    }
}
