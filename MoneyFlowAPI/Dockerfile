# =========================
# BUILD
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copiar o repositório inteiro
COPY . .

# entrar na pasta correta
WORKDIR /src/MoneyFlow/MoneyFlowAPI

# restaurar dependências
RUN dotnet restore MoneyFlowAPI.csproj

# publicar
RUN dotnet publish MoneyFlowAPI.csproj -c Release -o /app/publish

# =========================
# RUNTIME
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:$PORT
EXPOSE 10000

ENTRYPOINT ["dotnet", "MoneyFlowAPI.dll"]
