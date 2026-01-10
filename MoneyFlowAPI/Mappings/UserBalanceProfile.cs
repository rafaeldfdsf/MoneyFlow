using AutoMapper;
using MoneyFlowAPI.Models;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Mappings
{
    public class UserBalanceProfile : Profile
    {
        public UserBalanceProfile()
        {
            CreateMap<UserBalance, DTO_UserBalance>();

            CreateMap<DTO_UserBalance, UserBalance>()
                .ForMember(d => d.UpdatedAt, o => o.Ignore())
                .ForMember(d => d.User, o => o.Ignore());
        }
    }
}
