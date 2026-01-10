using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Services.Interfaces;
using MoneyFlowShared.DTOs;

namespace MoneyFlowAPI.Services
{
    public class UserBalanceService : IUserBalanceService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public UserBalanceService(AppDbContext context,
                                  IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        #region GET
        public async Task<DTO_ResponseTable<DTO_UserBalance>> GetUserBalance(int userId)
        {
            UserBalance? userBalance = await _context.UserBalances
                        .FirstOrDefaultAsync(t => t.UserId == userId);

            if (userBalance == null)
                return DTO_ResponseTable<DTO_UserBalance>.FailureResult("Erro ao obter saldo atual.");

            var dtoList = _mapper.Map<DTO_UserBalance>(userBalance);

            return DTO_ResponseTable<DTO_UserBalance>.SuccessResult(dtoList);
        }
        #endregion

        #region PUT
        public async Task UpdateUserBalanceAsync(int userId, Transaction newTransaction, Transaction? oldTransaction = null, bool isDelete = false)
        {
            decimal delta;

            if (oldTransaction != null)
            {
                // UPDATE: aplica apenas a diferença
                delta = GetSignedImpact(newTransaction) - GetSignedImpact(oldTransaction);
            }
            else
            {
                // CREATE ou DELETE
                delta = GetSignedImpact(newTransaction);
                if (isDelete)
                    delta *= -1; // DELETE desfaz
            }

            var balance = await _context.UserBalances
                .SingleOrDefaultAsync(b => b.UserId == userId);

            if (balance == null)
            {
                balance = new UserBalance
                {
                    UserId = userId,
                    CurrentBalance = 0m,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.UserBalances.Add(balance);
            }

            balance.CurrentBalance += delta;
            balance.UpdatedAt = DateTime.UtcNow;
        }

        private static decimal GetSignedImpact(Transaction t)
        {
            // Receita => +Amount | Despesa => -Amount
            return t.IsIncome ? t.Amount : -t.Amount;
        }
        #endregion
    }
}