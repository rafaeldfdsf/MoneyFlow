namespace MoneyFlowAPI.Application.DTOs
{
    public class DTO_ResponseTable<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        public static DTO_ResponseTable<T> SuccessResult(T data, string? message = null)
        {
            return new DTO_ResponseTable<T>
            {
                Success = true,
                Message = message ?? "Operação realizada com sucesso.",
                Data = data
            };
        }

        public static DTO_ResponseTable<T> FailureResult(string message)
        {
            return new DTO_ResponseTable<T>
            {
                Success = false,
                Message = message,
                Data = default
            };
        }
    }
}
