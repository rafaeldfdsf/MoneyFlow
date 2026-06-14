using System;

namespace MoneyFlowAPI.Models;

public partial class Card
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public string CardType { get; set; } = null!;

    public string? Brand { get; set; }

    public string? Last4Digits { get; set; }

    public decimal? CreditLimit { get; set; }

    public int? ClosingDay { get; set; }

    public int? DueDay { get; set; }

    public bool IsActive { get; set; }

    public DateTime? CreatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
