namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_CategoriesPage
    {
        public List<DTO_Category> Categories { get; set; } = new();

        public int TotalCategoriesCount { get; set; }

        public int MonthlyCategoriesCount { get; set; }

        public string LatestCategoryName { get; set; } = "Sem dados";

        public DateTime? LatestCategoryCreatedAt { get; set; }
    }
}
