using AutoMapper;
using MoneyFlowAPI.Models;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class TransactionProfile : Profile
    {
        public TransactionProfile()
        {
            CreateMap<Transaction, DTO_Transactions>()
                .ForMember(
                    dest => dest.Type,
                    opt => opt.MapFrom(src => src.IsIncome ? "Entrada" : "Saída")
                );

            CreateMap<DTO_Transactions, Transaction>();
        }
    }
}