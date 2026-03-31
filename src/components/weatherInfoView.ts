import { DateFormatter } from "../services/dateFormatter";
import { EventEmitter } from "../eventBus";
import { WeatherData } from "../data/weatherData";
import { View } from "../data/view";

export class WeatherInfoView implements View {
  private eventBus: EventEmitter;
  private root: HTMLDivElement;
  private weatherInfoEl: HTMLDivElement;
  private lastUpdateEl: HTMLDivElement;

  private interval;
  private handlerRender: (weather: WeatherData) => void;

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;

    this.root = document.createElement("div");
    this.root.className = "card";

    this.root.innerHTML = `
      <!-- Empty state - shown initially -->
      <div id="weatherData">
        <div class="weather-header">
          <div>
            <h2 id="cityName"></h2>
            <p id="currentDateTime"></p>
          </div>
          <div class="last-updated">
            <i class="fas fa-history"></i>
            <span id="lastUpdated">Updated just now</span>
          </div>
        </div>

        <div class="weather-content">
          <div class="current-weather">
            <div class="weather-primary">
              <div class="weather-icon">
                <img
                  src="https://openweathermap.org/img/wn/04d@2x.png"
                />
              </div>
              <div>
                <div class="temperature">°C</div>
                <div class="weather-description"></div>
              </div>
            </div>

            <div class="weather-details">
              <div class="weather-detail">
                <i class="fas fa-wind"></i>
                <div>
                  <p>Ветер</p>
                  <p data-wind>m/s</p>
                </div>
              </div>
              <div class="weather-detail">
                <i class="fas fa-tint"></i>
                <div>
                  <p>Влажность</p>
                  <p humid>%</p>
                </div>
              </div>
              <div class="weather-detail">
                <i class="fas fa-compress-alt"></i>
                <div>
                  <p>Давление</p>
                  <p pressure>hPa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const weatherInfoEl = this.root.querySelector("#weatherData");
    if (!weatherInfoEl) throw new Error("Weather info element not found");
    this.weatherInfoEl = weatherInfoEl as HTMLDivElement;

    const lastUpdateEl = this.root.querySelector("#lastUpdated");
    if (!lastUpdateEl) throw new Error("Last update element not found");
    this.lastUpdateEl = lastUpdateEl as HTMLDivElement;

    const lastUpdateValue = new Date();
    this.interval = setInterval(
      () => this.updateLastUpdated(lastUpdateValue),
      60000,
    );

    this.handlerRender = (weather) => this.render(weather);
    this.eventBus.on("weatherLoaded", this.handlerRender);
  }

  render(weatherData: WeatherData) {
    const icon = weatherData.weather[0].icon;

    this.weatherInfoEl.querySelector("#cityName")!.textContent =
      weatherData.name;
    (
      this.weatherInfoEl.querySelector(".weather-icon img")! as HTMLImageElement
    ).src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    this.weatherInfoEl.querySelector(".temperature")!.textContent =
      Math.round(weatherData.main.temp) + "°C";
    this.weatherInfoEl.querySelector(".weather-description")!.textContent =
      weatherData.weather[0].description;
    this.weatherInfoEl.querySelector("[data-wind]")!.textContent =
      weatherData.wind.speed + " м/с";
    this.weatherInfoEl.querySelector("[humid]")!.textContent =
      weatherData.main.humidity + "%";
    this.weatherInfoEl.querySelector("[pressure]")!.textContent =
      weatherData.main.pressure + " Па";
    this.weatherInfoEl.querySelector("#currentDateTime")!.textContent =
      DateFormatter.getLongDate();

    this.updateLastUpdated(new Date());
  }

  getElement(): HTMLDivElement {
    return this.root;
  }

  updateLastUpdated(lastUpdate: Date) {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - lastUpdate.getTime()) / 60000,
    );

    if (diffMinutes === 0) {
      this.lastUpdateEl.textContent = "Обновлено только что";
    } else if (diffMinutes === 1) {
      this.lastUpdateEl.textContent = "Обновлено 1 минуту назад";
    } else {
      this.lastUpdateEl.textContent = `Обновлено ${diffMinutes} минут назад`;
    }
  }

  destroy() {
    this.root.innerHTML = "";
    clearInterval(this.interval);
    this.eventBus.off("weatherLoaded", this.handlerRender);
  }
}
