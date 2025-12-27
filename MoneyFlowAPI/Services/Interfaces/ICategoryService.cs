using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        #region GET
        Task<DTO_ResponseTable<List<DTO_Category>>> GetAllCategoriesAsync(int userId);
        Task<DTO_ResponseTable<DTO_Category>> GetCategoryAsync(int id);
        #endregion

        #region POST
        Task<DTO_ResponseTable<DTO_Category>> CreateCategoryAsync(DTO_Category category, int userId);
        #endregion

        #region PUT
        Task<DTO_ResponseTable<DTO_Category>> UpdateCategoryAsync(DTO_Category category);
        #endregion

        #region DELETE
        Task<DTO_ResponseTable<string>> DeleteCategoriesAsync(List<int> categories);
        #endregion
    }
}
