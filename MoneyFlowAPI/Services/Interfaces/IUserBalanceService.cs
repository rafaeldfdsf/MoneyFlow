using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface IUserBalanceService
    {
        #region PUT
        Task UpdateUserBalanceAsync(int userId, Transaction created);
        #endregion
    }
}
