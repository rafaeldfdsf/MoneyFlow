using TypeGen.Core.TypeAnnotations;

namespace MoneyFlowShared.DTOs
{
    [ExportTsClass]
    public class DTO_AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
