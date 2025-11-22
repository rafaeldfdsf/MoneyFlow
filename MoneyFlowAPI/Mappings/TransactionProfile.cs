using AutoMapper;
using MoneyFlowAPI.Models;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class TransactionProfile : Profile
    {
        public TransactionProfile()
        {
            CreateMap<Transaction, DTO_Transactions>();
        }
    }
}