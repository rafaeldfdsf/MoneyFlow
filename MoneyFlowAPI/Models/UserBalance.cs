using System;
using System.Collections.Generic;

namespace MoneyFlowAPI.Models;

public partial class UserBalance
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal CurrentBalance { get; set; }

    public DateTime UpdatedAt { get; set; }

    public virtual User User { get; set; } = null!;
}
