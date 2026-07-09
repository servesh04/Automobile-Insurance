FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.ClaimService/AutoInsurance.ClaimService.csproj", "AutoInsurance.ClaimService/"]
RUN dotnet restore "AutoInsurance.ClaimService/AutoInsurance.ClaimService.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.ClaimService"
RUN dotnet build "AutoInsurance.ClaimService.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.ClaimService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.ClaimService.dll"]
