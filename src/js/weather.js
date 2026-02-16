import "../css/styles.css";

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

  const lastUpdateEl = document.querySelector("#lastUpdated");
  const weatherInfoEl = document.querySelector("#weatherData");
  const mapEl = document.querySelector(".map-container");

  const historyList = document.querySelector(".history-list");
  const historyItemtemplate = document.querySelector("#history-item-template");

  input.value = "";
  let lastUpdateValue = new Date();
  setInterval(() => updateLastUpdated(lastUpdateEl, lastUpdateValue), 60000);

  let weather;
  try {
    if (cityNameParam) {
      weather = await getWeatherByCityName(cityNameParam);
    } else {
      const position = await getCurrentPosition();
      weather = await getWeatherByGeolocation(
        position.coords.latitude,
        position.coords.longitude,
      );
    }

    console.log(weather);
    showWeather(weatherInfoEl, weather);
    addHistoryItem(weather, historyItemtemplate, historyList);
    showMap(mapEl, weather.name, weather.coord.lat, weather.coord.lon);
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
      weather = await getWeatherByCityName(cityName);
      showWeather(weatherInfoEl, weather);
      addHistoryItem(weather, historyItemtemplate, historyList);
      showMap(mapEl, weather.name, weather.coord.lat, weather.coord.lon);
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
    historyList.innerHTML = "";
  });
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function getWeatherByCityName(cityName) {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&q=${cityName}&appid=c722da73a7894ccbda8169bd7d4e9dc2`,
  );
  return await response.json();
}

async function getWeatherByGeolocation(latitude, longitude) {
  console.log(latitude);
  const weatherResponse = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&lat=${latitude}&lon=${longitude}&appid=c722da73a7894ccbda8169bd7d4e9dc2`,
  );
  const weatherData = await weatherResponse.json();
  const geoResponse = await fetch(
    `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=c722da73a7894ccbda8169bd7d4e9dc2`,
  );
  const geoData = await geoResponse.json();

  if (geoData[0]?.local_names?.ru) {
    weatherData.name = geoData[0].local_names.ru;
  }

  return weatherData;
}

export function showWeather(weatherInfoEl, weatherData) {
  const icon = weatherData.weather[0].icon;

  weatherInfoEl.querySelector("#cityName").textContent = weatherData.name;
  weatherInfoEl.querySelector(".weather-icon img").src =
    `https://openweathermap.org/img/wn/${icon}@2x.png`;
  weatherInfoEl.querySelector(".temperature").textContent =
    Math.round(weatherData.main.temp) + "°C";
  weatherInfoEl.querySelector(".weather-description").textContent =
    weatherData.weather[0].description;
  weatherInfoEl.querySelector("[data-wind]").textContent =
    weatherData.wind.speed + " м/с";
  weatherInfoEl.querySelector("[humid]").textContent =
    weatherData.main.humidity + "%";
  weatherInfoEl.querySelector("[pressure]").textContent =
    weatherData.main.pressure + " Па";
  weatherInfoEl.querySelector("#currentDateTime").textContent = getLongDate();

  updateLastUpdated(weatherInfoEl.querySelector("#lastUpdated"), new Date());
}

export async function showMap(mapEl, name, lat, lon) {
  const mapUrl = `https://static-maps.yandex.ru/v1?ll=${lon},${lat}&z=12&l=map&pt=${lon},${lat},pm2rdm&lang=ru_RU&size=450,450&apikey=2e0af910-8693-4179-a540-f192dfc6967f`;
  const img = mapEl.querySelector("img");
  img.src = mapUrl;
  img.alt = `Карта ${name}`;
}

export function updateLastUpdated(el, lastUpdate) {
  const now = new Date();
  const diffMinutes = Math.floor((now - lastUpdate) / 60000);

  if (diffMinutes === 0) {
    el.textContent = "Обновлено только что";
  } else if (diffMinutes === 1) {
    el.textContent = "Обновлено 1 минуту назад";
  } else {
    el.textContent = `Обновлено ${diffMinutes} минут назад`;
  }
}

export function addHistoryItem(weatherData, itemTemplate, historyList) {
  const cityName = weatherData.name;

  const existingItem = Array.from(historyList.children).find(
    (item) => item.querySelector(".city-name")?.textContent === cityName,
  );

  if (existingItem) {
    historyList.removeChild(existingItem);
  }

  const clone = itemTemplate.content.cloneNode(true);
  clone.querySelector(".city-name").textContent = weatherData.name;
  clone.querySelector(".city-datetime").textContent = getShortDateAndTime();
  clone.querySelector(".weather-temp").textContent =
    Math.round(weatherData.main.temp) + "°C";
  clone.querySelector(".weather-desc").textContent =
    weatherData.weather[0].description;
  historyList.prepend(clone);

  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastElementChild);
  }
}

export function getShortDateAndTime(date = new Date()) {
  return date.toLocaleDateString("ru-RU", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getLongDate(date = new Date()) {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initWeather);
}
