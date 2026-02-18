import { updateLastUpdated, addHistoryItem } from "../js/weather.js";
//import { fireEvent } from "@testing-library/dom";
import fs from "fs";
import path from "path";

function setupDOM() {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../pages/weather.html"),
    "utf8",
  );

  document.documentElement.innerHTML = html;
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

    const mockWeatherData = {
      name: "Москва",
      main: {
        temp: 5,
      },
      weather: [
        {
          description: "Облачно",
        },
      ],
    };

    addHistoryItem(mockWeatherData, template, historyList);

    const item = historyList.querySelector(".history-item");
    expect(item).not.toBeNull();
    expect(item.querySelector(".city-name").textContent).toBe("Москва");
    expect(item.querySelector(".weather-temp").textContent).toBe("5°C");
    expect(item.querySelector(".weather-desc").textContent).toBe("Облачно");
    expect(item.querySelector(".city-datetime").textContent).not.toBe("");
  });
});
