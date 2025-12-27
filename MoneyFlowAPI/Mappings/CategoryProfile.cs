using AutoMapper;
using MoneyFlowAPI.Models;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class CategoryProfile : Profile
    {
        public CategoryProfile()
        {
            CreateMap<Category, DTO_Category>();
            CreateMap<DTO_Category, Category>();
        }
    }
}
