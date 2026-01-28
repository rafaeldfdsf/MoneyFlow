using MoneyFlowAPI.Application.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface ITransactionService
    {
        #region GET
        Task<DTO_ResponseTable<List<DTO_Transactions>>> GetAllTransactionsAsync(int userId);
        Task<DTO_ResponseTable<DTO_Transactions>> GetTransactionAsync(int id);
        #endregion

        #region POST
        Task<DTO_ResponseTable<DTO_Transactions>> CreateTransactionAsync(DTO_Transactions transaction, int userId);
        #endregion

        #region PUT
        Task<DTO_ResponseTable<DTO_Transactions>> UpdateTransactionAsync(DTO_Transactions transaction, int userId);
        #endregion

        #region DELETE
        Task<DTO_ResponseTable<string>> DeleteTransactionsAsync(List<int> transactions, int userId);
        #endregion
    }
}
