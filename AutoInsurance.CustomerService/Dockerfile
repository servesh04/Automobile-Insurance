FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.CustomerService/AutoInsurance.CustomerService.csproj", "AutoInsurance.CustomerService/"]
RUN dotnet restore "AutoInsurance.CustomerService/AutoInsurance.CustomerService.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.CustomerService"
RUN dotnet build "AutoInsurance.CustomerService.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.CustomerService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.CustomerService.dll"]
