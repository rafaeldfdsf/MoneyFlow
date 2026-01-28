using AutoMapper;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Application.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class TransactionProfile : Profile
    {
        public TransactionProfile()
        {
            CreateMap<Transaction, DTO_Transactions>()
             // IsIncome -> Type
             .ForMember(
                 dest => dest.Type,
                 opt => opt.MapFrom(src => src.IsIncome ? "Entrada" : "Saída")
             )

             // DateOnly -> DateTime
             .ForMember(
                 dest => dest.TransactionDate,
                 opt => opt.MapFrom(src =>
                     src.TransactionDate.ToDateTime(TimeOnly.MinValue)
                 )
             )

             // Navegações
             .ForMember(
                 dest => dest.Category,
                 opt => opt.MapFrom(src => src.Category)
             )
             .ForSourceMember(
                 src => src.User,
                 opt => opt.DoNotValidate()
             );

            CreateMap<DTO_Transactions, Transaction>()
                // DateTime -> DateOnly
                .ForMember(
                    dest => dest.TransactionDate,
                    opt => opt.MapFrom(src =>
                        DateOnly.FromDateTime(src.TransactionDate)
                    )
                )

                // Navegações EF (não recriar entidades)
                .ForMember(dest => dest.User, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());
        }
    }
}