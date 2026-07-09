FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.PolicyService/AutoInsurance.PolicyService.csproj", "AutoInsurance.PolicyService/"]
RUN dotnet restore "AutoInsurance.PolicyService/AutoInsurance.PolicyService.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.PolicyService"
RUN dotnet build "AutoInsurance.PolicyService.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.PolicyService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.PolicyService.dll"]
