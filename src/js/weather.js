import "../css/styles.css";
import { WeatherService } from "../services/weatherService.js";
import { LocationService } from "../services/locationService.js";
import { StorageService } from "../services/storageService.js";
import { EventEmitter } from "../eventBus.js";
import { WeatherInfoView } from "../components/weatherInfoView.js";
import { MapView } from "../components/mapView.js";
import { HistoryView } from "../components/historyView.js";

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

  const eventBus = new EventEmitter();

  const weatherService = new WeatherService();
  const locationService = new LocationService();
  new StorageService(eventBus);

  new WeatherInfoView(eventBus);
  new MapView(eventBus);
  new HistoryView(eventBus);

  input.value = "";

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

    eventBus.emit("weather:loaded", weather);
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
      eventBus.emit("weather:loaded", weather);
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
    eventBus.emit("history:clear");
  });
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initWeather);
}
