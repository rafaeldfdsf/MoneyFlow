using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Application.Categories
{
    public class CreateCategory
    {
        private readonly AppDbContext _context;

        public CreateCategory(AppDbContext context) => _context = context;

        public async Task<Category?> ExecuteAsync(Category category, int userId)
        {
            if (category == null)
                return null;

            category.CreatedAt ??= DateTime.UtcNow;
            category.UserId = userId;

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return category;
        }
    }
}
