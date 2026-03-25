import "../css/styles.css";
import { WeatherService } from "../services/weatherService.js";
import { LocationService } from "../services/locationService.js";
import { StorageService } from "../services/storageService.js";
import { WeatherView } from "../view/weatherView.js";

async function initWeather() {
  const params = new URLSearchParams(window.location.search);
  const cityNameParam = params.get("city");

  const searchForm = document.querySelector("form");
  const input = document.querySelector("#cityInput");
  const submitBtn = document.querySelector("#submitButton");
  const clearHistoryBtn = document.querySelector(
    ".history-actions .btn-secondary",
  );
  const clearInputBtn = document.querySelector("#clearButton");

  const weatherService = new WeatherService();
  const locationService = new LocationService();
  const storageService = new StorageService();

  const weatherView = new WeatherView();

  input.value = "";
  let lastUpdateValue = new Date();
  setInterval(() => weatherView.updateLastUpdated(lastUpdateValue), 60000);

  let weather;
  try {
    if (cityNameParam) {
      weather = await weatherService.getWeatherByCityName(cityNameParam);
    } else {
      const position = await locationService.getCurrentPosition();
      weather = await weatherService.getWeatherByGeolocation(
        position.coords.latitude,
        position.coords.longitude,
      );
    }

    console.log(weather);
    weatherView.renderWeather(weather);
    const history = storageService.addItemHistory(weather);
    weatherView.renderHistory(history);
    weatherView.renderMap(weather.name, weather.coord.lat, weather.coord.lon);
  } catch (err) {
    alert("Город не найден");
    console.log(err);
  }

  //Listeners
  input.addEventListener("input", () => {
    submitBtn.disabled = !input.value.trim();
  });

  searchForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const formElement = ev.target;
    const inputEl = formElement.querySelector("input");
    const cityName = inputEl.value;

    try {
      weather = await weatherService.getWeatherByCityName(cityName);
      weatherView.renderWeather(weather);
      const history = storageService.addItemHistory(weather);
      weatherView.renderHistory(history);
      weatherView.renderMap(weather.name, weather.coord.lat, weather.coord.lon);
    } catch (err) {
      alert("Город не найден");
      console.log(err);
    }
  });

  clearInputBtn.addEventListener("click", () => {
    input.value = "";
    submitBtn.disabled = true;
    input.focus();
  });

  clearHistoryBtn.addEventListener("click", () => {
    storageService.clearHistory();
    weatherView.clearHistory();
  });
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initWeather);
}
