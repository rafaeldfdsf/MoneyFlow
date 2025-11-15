using TypeGen.Core.TypeAnnotations;

namespace MoneyFlowShared.DTOs
{
    [ExportTsClass]
    public class DTO_Register
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}