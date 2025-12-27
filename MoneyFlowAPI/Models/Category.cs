using System;
using System.Collections.Generic;

namespace MoneyFlowAPI.Models;

public partial class Category
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Name { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }

    public virtual ICollection<Categories> Transactions { get; set; } = new List<Categories>();

    public virtual User User { get; set; } = null!;
}
