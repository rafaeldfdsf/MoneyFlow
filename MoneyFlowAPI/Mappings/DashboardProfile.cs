using AutoMapper;
using MoneyFlowAPI.Application.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class DashboardProfile : Profile
    {
        public DashboardProfile()
        {
            CreateMap<DashboardTopCategorySummary, DTO_DashboardTopCategory>();

            CreateMap<DashboardSummary, DTO_Dashboard>()
                .ForMember(
                    dest => dest.TopCategories,
                    opt => opt.MapFrom(src => src.TopCategories)
                );
        }
    }
}
