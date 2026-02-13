import { updateLastUpdated, addHistoryItem } from "../js/weather.js";
//import { fireEvent } from "@testing-library/dom";

function setupDOM() {
  document.body.innerHTML = `
    <form>
      <input id="cityInput" />
      <button id="submitButton" disabled>Submit</button>
    </form>

    <div class="history-actions">
        <button class="btn-secondary"></button>
    </div>

    <h2 id="cityName"></h2>
    <span id="currentDateTime"></span>
    <span id="lastUpdated"></span>

    <ul class="history-list"></ul>

    <template id="history-item-template">
      <li class="history-item">
        <span class="city-name"></span>
        <span class="city-datetime"></span>
        <span class="weather-temp"></span>
        <span class="weather-desc"></span>
      </li>
    </template>
  `;
}

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("Unit tests", () => {
  test("updateLastUpdated shows the correct time", () => {
    setupDOM();
    const el = document.querySelector("#lastUpdated");

    const twoMinutesAgo = new Date(Date.now() - 2 * 60000);
    updateLastUpdated(el, twoMinutesAgo);
    expect(el.textContent).toBe("Обновлено 2 минут назад");

    const oneMinuteAgo = new Date(Date.now() - 60000);
    updateLastUpdated(el, oneMinuteAgo);
    expect(el.textContent).toBe("Обновлено 1 минуту назад");

    const now = new Date();
    updateLastUpdated(el, now);
    expect(el.textContent).toBe("Обновлено только что");
  });

  test("addHistoryItem adds a history item with the correct data", () => {
    setupDOM();

    const historyList = document.querySelector(".history-list");
    const template = document.querySelector("#history-item-template");

    addHistoryItem("Москва", "5°C", "Облачно", template, historyList);

    const item = historyList.querySelector(".history-item");
    expect(item).not.toBeNull();
    expect(item.querySelector(".city-name").textContent).toBe("Москва");
    expect(item.querySelector(".weather-temp").textContent).toBe("5°C");
    expect(item.querySelector(".weather-desc").textContent).toBe("Облачно");
    expect(item.querySelector(".city-datetime").textContent).not.toBe("");
  });
});
