FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.ApiGateway/AutoInsurance.ApiGateway.csproj", "AutoInsurance.ApiGateway/"]
RUN dotnet restore "AutoInsurance.ApiGateway/AutoInsurance.ApiGateway.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.ApiGateway"
RUN dotnet build "AutoInsurance.ApiGateway.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.ApiGateway.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.ApiGateway.dll"]
