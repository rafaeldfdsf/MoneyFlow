using System.Globalization;
using Microsoft.EntityFrameworkCore;
using MoneyFlowAPI.Application.DTOs;
using MoneyFlowAPI.Models;
using MoneyFlowAPI.Services.Interfaces;

namespace MoneyFlowAPI.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<DTO_ResponseTable<DTO_Dashboard>> GetDashboardAsync(int userId)
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);
                var firstDayOfMonth = new DateOnly(today.Year, today.Month, 1);
                var firstDayOfNextMonth = firstDayOfMonth.AddMonths(1);

                var balance = await _context.UserBalances
                    .Where(userBalance => userBalance.UserId == userId)
                    .Select(userBalance => userBalance.CurrentBalance)
                    .FirstOrDefaultAsync();

                var monthlyTransactions = await _context.Transactions
                    .AsNoTracking()
                    .Include(transaction => transaction.Category)
                    .Where(transaction =>
                        transaction.UserId == userId &&
                        transaction.TransactionDate >= firstDayOfMonth &&
                        transaction.TransactionDate < firstDayOfNextMonth)
                    .ToListAsync();

                var latestTransaction = await _context.Transactions
                    .AsNoTracking()
                    .Where(transaction => transaction.UserId == userId)
                    .OrderByDescending(transaction => transaction.TransactionDate)
                    .ThenByDescending(transaction => transaction.CreatedAt)
                    .FirstOrDefaultAsync();

                var monthlyIncome = monthlyTransactions
                    .Where(transaction => transaction.IsIncome)
                    .Sum(transaction => transaction.Amount);

                var monthlyExpense = monthlyTransactions
                    .Where(transaction => !transaction.IsIncome)
                    .Sum(transaction => transaction.Amount);

                var netSavings = monthlyIncome - monthlyExpense;
                var savingsRate = monthlyIncome > 0
                    ? decimal.Round((netSavings / monthlyIncome) * 100, 2)
                    : 0;

                var topCategories = monthlyTransactions
                    .Where(transaction => !transaction.IsIncome)
                    .GroupBy(transaction => string.IsNullOrWhiteSpace(transaction.Category?.Name) ? "Sem categoria" : transaction.Category!.Name)
                    .Select(group => new DTO_DashboardTopCategory
                    {
                        Name = group.Key,
                        Total = group.Sum(transaction => transaction.Amount),
                        Percentage = monthlyExpense > 0
                            ? decimal.Round((group.Sum(transaction => transaction.Amount) / monthlyExpense) * 100, 2)
                            : 0,
                        TransactionsCount = group.Count()
                    })
                    .OrderByDescending(category => category.Total)
                    .Take(5)
                    .ToList();

                var monthLabel = new DateTime(today.Year, today.Month, 1)
                    .ToString("MMMM 'de' yyyy", CultureInfo.GetCultureInfo("pt-PT"));

                var dto = new DTO_Dashboard
                {
                    MonthLabel = monthLabel,
                    CurrentBalance = balance,
                    MonthlyIncome = monthlyIncome,
                    MonthlyExpense = monthlyExpense,
                    NetSavings = netSavings,
                    MonthlyTransactionsCount = monthlyTransactions.Count,
                    SavingsRate = savingsRate,
                    LatestTransactionDescription = latestTransaction?.Description?.Trim() switch
                    {
                        { Length: > 0 } description => description,
                        _ => "Sem movimentos"
                    },
                    LatestTransactionDate = latestTransaction?.TransactionDate,
                    TopCategories = topCategories
                };

                return DTO_ResponseTable<DTO_Dashboard>.SuccessResult(dto);
            }
            catch (Exception ex)
            {
                return DTO_ResponseTable<DTO_Dashboard>.FailureResult($"Erro ao obter dashboard: {ex.Message}");
            }
        }
    }
}
