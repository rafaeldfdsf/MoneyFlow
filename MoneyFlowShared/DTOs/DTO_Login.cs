using TypeGen.Core.TypeAnnotations;

namespace MoneyFlowShared.DTOs
{
    [ExportTsClass]
    public class DTO_Login
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}