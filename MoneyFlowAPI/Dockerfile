# ---------- BUILD ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# copiar tudo o que está no repositório
COPY . .

# ir para a pasta da API
WORKDIR /src/MoneyFlowAPI

# restaurar dependências
RUN dotnet restore

# publicar aplicação
RUN dotnet publish -c Release -o /app/publish

# ---------- RUNTIME ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "MoneyFlowAPI.dll"]
