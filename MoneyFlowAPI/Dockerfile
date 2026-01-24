# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copiar tudo
COPY . .

# entrar na pasta da API
WORKDIR /src/MoneyFlowAPI

# restaurar dependências
RUN dotnet restore

# compilar
RUN dotnet publish -c Release -o /app/publish

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

# Render usa a variável PORT
ENV ASPNETCORE_URLS=http://+:$PORT

EXPOSE 10000

ENTRYPOINT ["dotnet", "MoneyFlowAPI.dll"]
