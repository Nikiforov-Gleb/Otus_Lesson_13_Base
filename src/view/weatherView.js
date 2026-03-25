import { DateFormatter } from "../services/dateFormatter.js";

export class WeatherView {
  constructor() {
    this.weatherInfoEl = document.querySelector("#weatherData");
    this.mapEl = document.querySelector(".map-container");

    this.historyListEl = document.querySelector(".history-list");
    this.historyItemtemplate = document.querySelector("#history-item-template");

    this.lastUpdateEl = document.querySelector("#lastUpdated");
  }

  renderWeather(weatherData) {
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

  async renderMap(name, lat, lon) {
    const mapUrl = `https://static-maps.yandex.ru/v1?ll=${lon},${lat}&z=12&l=map&pt=${lon},${lat},pm2rdm&lang=ru_RU&size=450,450&apikey=2e0af910-8693-4179-a540-f192dfc6967f`;
    const img = this.mapEl.querySelector("img");
    img.src = mapUrl;
    img.alt = `Карта ${name}`;
  }

  renderHistory(history) {
    this.historyListEl.innerHTML = "";

    history.forEach((item) => {
      const clone = this.historyItemtemplate.content.cloneNode(true);

      clone.querySelector(".city-name").textContent = item.name;
      clone.querySelector(".city-datetime").textContent = item.time;
      clone.querySelector(".weather-temp").textContent = item.temp + "°C";
      clone.querySelector(".weather-desc").textContent = item.description;

      this.historyListEl.append(clone);
    });
  }

  clearHistory() {
    this.historyListEl.innerHTML = "";
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
