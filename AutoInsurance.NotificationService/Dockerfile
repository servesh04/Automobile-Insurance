FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["AutoInsurance.NotificationService/AutoInsurance.NotificationService.csproj", "AutoInsurance.NotificationService/"]
RUN dotnet restore "AutoInsurance.NotificationService/AutoInsurance.NotificationService.csproj"
COPY . .
WORKDIR "/src/AutoInsurance.NotificationService"
RUN dotnet build "AutoInsurance.NotificationService.csproj" -c Release -o /app/build
RUN dotnet publish "AutoInsurance.NotificationService.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AutoInsurance.NotificationService.dll"]
