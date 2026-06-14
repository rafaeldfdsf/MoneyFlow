using AutoMapper;
using MoneyFlowAPI.Application.DTOs;
using MoneyFlowAPI.Models;

namespace MoneyFlowAPI.Mappings
{
    public class CardProfile : Profile
    {
        public CardProfile()
        {
            CreateMap<Card, DTO_Card>()
                // Traduz o tipo persistido para um texto pronto a apresentar na UI.
                .ForMember(
                    dest => dest.CardTypeLabel,
                    opt => opt.MapFrom(src => src.CardType == "Credit" ? "Crédito" : "Débito")
                )
                // Mantém apenas o identificador visual final sem expor o número completo.
                .ForMember(
                    dest => dest.MaskedNumber,
                    opt => opt.MapFrom(src => string.IsNullOrWhiteSpace(src.Last4Digits) ? "Sem final" : $"**** {src.Last4Digits}")
                )
                .ForSourceMember(src => src.User, opt => opt.DoNotValidate());

            CreateMap<DTO_Card, Card>()
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
