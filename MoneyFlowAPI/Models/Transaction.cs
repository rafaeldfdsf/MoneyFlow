using System;
using System.Collections.Generic;

namespace MoneyFlowAPI.Models;

public partial class Transaction
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int? CategoryId { get; set; }

    public bool IsIncome { get; set; }

    public decimal Amount { get; set; }

    public string? Description { get; set; }

    public DateOnly TransactionDate { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual Category? Category { get; set; }

    public virtual User User { get; set; } = null!;
}
