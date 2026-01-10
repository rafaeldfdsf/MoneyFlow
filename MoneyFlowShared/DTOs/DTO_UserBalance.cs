using TypeGen.Core.TypeAnnotations;

namespace MoneyFlowShared.DTOs
{
    [ExportTsClass]
    public class DTO_UserBalance
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public decimal CurrentBalance { get; set; }
    }
}
