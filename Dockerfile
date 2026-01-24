# =========================
# BUILD
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copiar tudo
COPY . .

# restaurar dependências
RUN dotnet restore MoneyFlowAPI/MoneyFlowAPI.csproj

# compilar
RUN dotnet publish MoneyFlowAPI/MoneyFlowAPI.csproj \
    -c Release \
    -o /app/publish \
    --no-restore

# =========================
# RUNTIME
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "MoneyFlowAPI.dll"]
