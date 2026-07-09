FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.AuthService/AutoInsurance.AuthService.csproj", "AutoInsurance.AuthService/"]
RUN dotnet restore "AutoInsurance.AuthService/AutoInsurance.AuthService.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.AuthService"
RUN dotnet build "AutoInsurance.AuthService.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.AuthService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.AuthService.dll"]
