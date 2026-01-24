# ============================
# Build stage
# ============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copiar tudo
COPY . .

# ir diretamente para o projeto da API
WORKDIR /src/MoneyFlowAPI

# restaurar apenas a API
RUN dotnet restore MoneyFlowAPI.csproj

# build
RUN dotnet publish MoneyFlowAPI.csproj -c Release -o /app/publish

# ============================
# Runtime stage
# ============================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "MoneyFlowAPI.dll"]
