import { DateFormatter } from "../services/dateFormatter";

export class WeatherInfoView {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.weatherInfoEl = document.querySelector("#weatherData");
    this.lastUpdateEl = document.querySelector("#lastUpdated");

    let lastUpdateValue = new Date();
    setInterval(() => this.updateLastUpdated(lastUpdateValue), 60000);

    this.eventBus.on("weather:loaded", (weather) => {
      this.render(weather);
    });
  }

  render(weatherData) {
    const icon = weatherData.weather[0].icon;

    this.weatherInfoEl.querySelector("#cityName").textContent =
      weatherData.name;
    this.weatherInfoEl.querySelector(".weather-icon img").src =
      `https://openweathermap.org/img/wn/${icon}@2x.png`;
    this.weatherInfoEl.querySelector(".temperature").textContent =
      Math.round(weatherData.main.temp) + "°C";
    this.weatherInfoEl.querySelector(".weather-description").textContent =
      weatherData.weather[0].description;
    this.weatherInfoEl.querySelector("[data-wind]").textContent =
      weatherData.wind.speed + " м/с";
    this.weatherInfoEl.querySelector("[humid]").textContent =
      weatherData.main.humidity + "%";
    this.weatherInfoEl.querySelector("[pressure]").textContent =
      weatherData.main.pressure + " Па";
    this.weatherInfoEl.querySelector("#currentDateTime").textContent =
      DateFormatter.getLongDate();

    this.updateLastUpdated(new Date());
  }

  updateLastUpdated(lastUpdate) {
    const now = new Date();
    const diffMinutes = Math.floor((now - lastUpdate) / 60000);

    if (diffMinutes === 0) {
      this.lastUpdateEl.textContent = "Обновлено только что";
    } else if (diffMinutes === 1) {
      this.lastUpdateEl.textContent = "Обновлено 1 минуту назад";
    } else {
      this.lastUpdateEl.textContent = `Обновлено ${diffMinutes} минут назад`;
    }
  }
}
