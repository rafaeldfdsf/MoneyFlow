using System;
using System.Collections.Generic;

namespace MoneyFlowAPI.Models;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public virtual ICollection<Category> Categories { get; set; } = new List<Category>();

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();

    public virtual UserBalance? UserBalance { get; set; }
}
