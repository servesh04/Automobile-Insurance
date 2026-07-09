FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.VehicleService/AutoInsurance.VehicleService.csproj", "AutoInsurance.VehicleService/"]
RUN dotnet restore "AutoInsurance.VehicleService/AutoInsurance.VehicleService.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.VehicleService"
RUN dotnet build "AutoInsurance.VehicleService.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.VehicleService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.VehicleService.dll"]
