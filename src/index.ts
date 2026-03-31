import "./css/styles.css";

import { EventEmitter } from "./eventBus";
import { WeatherService } from "./services/weatherService";
import { LocationService } from "./services/locationService";
import { StorageService } from "./services/storageService";

import { renderWeatherPage } from "./pages/weatherPage";
import { renderStartPage } from "./pages/startPage";
import { renderAboutPage } from "./pages/aboutPage";

declare const PRODUCTION: boolean;
declare const PREFIX: string;

const app = document.getElementById("app");
const eventBus = new EventEmitter();

const weatherService = new WeatherService();
const locationService = new LocationService();
const storageService = new StorageService(eventBus);
const base_url = PRODUCTION ? PREFIX : "/";

async function init() {
  console.log(base_url);
  eventBus.on("weatherSubmit", onSubmitCity);
  window.addEventListener("popstate", router);

  const aboutBtn = document.querySelector(".about-button");
  aboutBtn!.addEventListener("click", onAboutClick);

  const path = window.location.pathname;
  const isStartPage = path === "/" || path.endsWith("index.html");

  if (isStartPage && "geolocation" in navigator) {
    try {
      const position = await locationService.getCurrentPosition();
      const weather = await weatherService.getWeatherByGeolocation(
        position.coords.latitude,
        position.coords.longitude,
      );

      window.history.pushState(
        { city: weather.name },
        "",
        `${base_url}weather/${weather.name}`,
      );
    } catch {
      window.history.pushState({}, "", `${base_url}`);
    }
  }
  router();
}

async function onSubmitCity(cityName: string) {
  const isWeatherPage = window.location.pathname.startsWith(
    `${base_url}weather/`,
  );
  window.history.pushState(
    { city: cityName },
    "",
    `${base_url}weather/${cityName}`,
  );

  if (isWeatherPage) {
    try {
      const weather = await weatherService.getWeatherByCityName(cityName);
      eventBus.emit("weatherLoaded", weather);
    } catch (err) {
      alert("Город не найден");
      console.log(err);
    }
  } else router();
}

function onAboutClick() {
  window.history.pushState({}, "", `${base_url}about`);
  router();
}

async function router() {
  const path = window.location.pathname;

  if (path === `${base_url}about`) {
    renderAboutPage(app!);
  } else if (path.startsWith(`${base_url}weather/`)) {
    const cityName = decodeURIComponent(path.split(`${base_url}weather/`)[1]);
    renderWeatherPage(app!, eventBus);

    try {
      const weather = await weatherService.getWeatherByCityName(cityName);
      eventBus.emit("weatherLoaded", weather);
    } catch (err) {
      alert("Город не найден");
      console.log(err);
    }
  } else {
    renderStartPage(app!, eventBus);
    eventBus.emit("historyUpdated", storageService.getHistory());
  }
}

init();
