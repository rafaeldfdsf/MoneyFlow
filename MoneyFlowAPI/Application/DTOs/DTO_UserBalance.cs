namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_UserBalance
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public decimal CurrentBalance { get; set; }
    }
}
