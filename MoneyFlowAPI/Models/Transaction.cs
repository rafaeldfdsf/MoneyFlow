namespace MoneyFlowAPI.Models;

public partial class Categories
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? CategoryId { get; set; }

    public bool IsIncome { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public DateTime TransactionDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Category? Category { get; set; }

    public virtual User User { get; set; } = null!;
}
