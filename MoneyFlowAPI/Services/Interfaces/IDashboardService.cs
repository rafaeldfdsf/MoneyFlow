using MoneyFlowAPI.Application.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface IDashboardService
    {
        Task<DTO_ResponseTable<DTO_Dashboard>> GetDashboardAsync(int userId);
    }
}
