using MoneyFlowAPI.Models;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface IUserBalanceService
    {
        #region GET
        Task<DTO_ResponseTable<DTO_UserBalance>> GetUserBalance(int userId);
        #endregion

        #region PUT
        Task UpdateUserBalanceAsync(int userId, Transaction newTransaction, Transaction? oldTransaction = null, bool isDelete = false);
        #endregion
    }
}
