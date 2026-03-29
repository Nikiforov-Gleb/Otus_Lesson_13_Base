import "./css/styles.css";

import { EventEmitter } from "./eventBus";
import { WeatherService } from "./services/weatherService";
import { LocationService } from "./services/locationService";
import { StorageService } from "./services/storageService";

import { renderWeatherPage } from "../src/pages/weatherPage";
import { renderStartPage } from "../src/pages/startPage";
import { renderAboutPage } from "./pages/aboutPage";

const app = document.getElementById("app");
const eventBus = new EventEmitter();

const weatherService = new WeatherService();
const locationService = new LocationService();
const storageService = new StorageService(eventBus);

async function init() {
  eventBus.on("weather:submit", onSubmitCity);
  window.addEventListener("popstate", router);

  const aboutBtn = document.querySelector(".about-button");
  aboutBtn.addEventListener("click", onAboutClick);

  const path = window.location.pathname;
  const isStartPage = path === "/" || path.endsWith("index.html");

  if (isStartPage && "geolocation" in navigator) {
    try {
      const position = await locationService.getCurrentPosition();

      let weather = await weatherService.getWeatherByGeolocation(
        position.coords.latitude,
        position.coords.longitude,
      );

      window.history.pushState(
        { city: weather.name },
        "",
        `/weather/${weather.name}`,
      );
    } catch {
      window.history.pushState({}, "", `/`);
    }
  }
  router();
}

async function onSubmitCity(cityName) {
  const isWeatherPage = window.location.pathname.startsWith("/weather/");
  window.history.pushState({ city: cityName }, "", `/weather/${cityName}`);

  if (isWeatherPage) {
    try {
      const weather = await weatherService.getWeatherByCityName(cityName);
      eventBus.emit("weather:loaded", weather);
    } catch (err) {
      alert("Город не найден");
      console.log(err);
    }
  } else router();
}

function onAboutClick() {
  window.history.pushState({}, "", `/about`);
  router();
}

async function router() {
  const path = window.location.pathname;

  if (path === "/about") {
    renderAboutPage(app);
  } else if (path.startsWith("/weather/")) {
    const cityName = decodeURIComponent(path.split("/weather/")[1]);
    renderWeatherPage(app, eventBus);

    try {
      const weather = await weatherService.getWeatherByCityName(cityName);
      eventBus.emit("weather:loaded", weather);
    } catch (err) {
      alert("Город не найден");
      console.log(err);
    }
  } else {
    renderStartPage(app, eventBus);
    eventBus.emit("history:updated", storageService.getHistory());
  }
}

init();
