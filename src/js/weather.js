import "../css/styles.css";

function initWeather() {
  const params = new URLSearchParams(window.location.search);
  const cityNameParam = params.get("city");

  const searchForm = document.querySelector("form");
  const input = document.querySelector("#cityInput");
  const submitBtn = document.querySelector("#submitButton");
  const clearHistoryBtn = document.querySelector(
    ".history-actions .btn-secondary",
  );
  const clearInputBtn = document.querySelector("#clearButton");

  const cityNameHeader = document.querySelector("#cityName");
  const lastUpdateEl = document.querySelector("#lastUpdated");

  const historyList = document.querySelector(".history-list");
  const historyItemtemplate = document.querySelector("#history-item-template");

  let lastUpdateValue = new Date();
  initialize();
  setInterval(() => updateLastUpdated(lastUpdateEl, lastUpdateValue), 60000);

  function initialize() {
    input.value = cityNameParam;

    cityNameHeader.textContent = cityNameParam;
    document.querySelector("#currentDateTime").textContent =
      new Date().toLocaleDateString("ru-RU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    updateLastUpdated(lastUpdateEl, lastUpdateValue);
    addHistoryItem(
      cityNameParam,
      "3°C",
      "Облачно",
      historyItemtemplate,
      historyList,
    );
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

    cityNameHeader.textContent = cityName;
    addHistoryItem(
      cityName,
      "3°C",
      "Облачно",
      historyItemtemplate,
      historyList,
    );
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

export function addHistoryItem(
  city,
  temp,
  description,
  itemTemplate,
  historyList,
) {
  const clone = itemTemplate.content.cloneNode(true);
  clone.querySelector(".city-name").textContent = city;
  clone.querySelector(".city-datetime").textContent =
    new Date().toLocaleDateString("ru-RU", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  clone.querySelector(".weather-temp").textContent = temp;
  clone.querySelector(".weather-desc").textContent = description;
  historyList.appendChild(clone);
}

if (typeof window !== "undefined") {
  document.addEventListener("DOMContentLoaded", initWeather);
}
