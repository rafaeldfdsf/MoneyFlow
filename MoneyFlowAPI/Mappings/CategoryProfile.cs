using AutoMapper;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Application.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, DTO_Category>()
            .ForSourceMember(src => src.Transactions, opt => opt.DoNotValidate())
            .ForSourceMember(src => src.User, opt => opt.DoNotValidate());

            CreateMap<DTO_Category, Category>()
                .ForMember(dest => dest.Transactions, opt => opt.Ignore())
                .ForMember(dest => dest.User, opt => opt.Ignore());
        }
    }
}
