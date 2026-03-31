import { HistoryView } from "../components/historyView";
import { WeatherData } from "../data/weatherData";
import { EventEmitter } from "../eventBus";
import { renderWeatherPage } from "../pages/weatherPage";

import fs from "fs";
import path from "path";

jest.mock("../services/dateFormatter.ts", () => ({
  DateFormatter: {
    getLongDate: jest.fn(() => "24.03.2026 11:45"),
  },
}));

function setupDOM() {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8",
  );

  document.documentElement.innerHTML = html;
}

describe("Weather view", () => {
  let eventBus: EventEmitter;

  const weatherData = {
    name: "Москва",
    main: {
      temp: 5,
      humidity: 80,
      pressure: 1012,
    },
    weather: [
      {
        description: "Облачно",
      },
    ],
    wind: {
      speed: 5,
    },
    coord: {
      lat: 55,
      lon: 37,
    },
  } as WeatherData;

  beforeEach(() => {
    jest.useFakeTimers();
    const start = new Date("2026-01-01T12:00:00");
    jest.setSystemTime(start);
    setupDOM();
    eventBus = new EventEmitter();
    renderWeatherPage(document.getElementById("app")!, eventBus);
    eventBus.emit("weatherLoaded", weatherData);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllTimers();
  });

  it("should correctly render weather info", () => {
    expect(document.querySelector("#cityName")!.textContent).toBe("Москва");
    expect(document.querySelector(".temperature")!.textContent).toBe("5°C");
    expect(document.querySelector(".weather-description")!.textContent).toBe(
      "Облачно",
    );
    expect(document.querySelector("[data-wind]")!.textContent).toBe("5 м/с");
    expect(document.querySelector("[humid]")!.textContent).toBe("80%");
    expect(document.querySelector("[pressure]")!.textContent).toBe("1012 Па");

    expect(document.querySelector("#currentDateTime")!.textContent).toBe(
      "24.03.2026 11:45",
    );
    expect(document.querySelector("#lastUpdated")!.textContent).toContain(
      "Обновлено",
    );
  });

  it("should correctly render map", async () => {
    const img = document.querySelector(
      ".map-container img",
    ) as HTMLImageElement;

    expect(img.alt).toBe("Карта Москва");
  });

  it("should correctly render history", async () => {
    new HistoryView(eventBus);
    const history = [
      {
        name: "Москва",
        time: "11:45",
        temp: 5,
        description: "Облачно",
      },
    ];

    eventBus.emit("historyUpdated", history);

    const item = document.querySelector(".history-item");
    expect(item).not.toBeNull();

    expect(item!.querySelector(".city-name")!.textContent).toBe("Москва");
    expect(item!.querySelector(".weather-temp")!.textContent).toBe("5°C");
    expect(item!.querySelector(".weather-desc")!.textContent).toBe("Облачно");
    expect(item!.querySelector(".city-datetime")!.textContent).toBe("11:45");
  });

  it("clearHistory should  removes all items", () => {
    document.querySelector(".history-list")!.innerHTML = "<li>test</li>";
    eventBus.emit("historyUpdated", []);

    expect(document.querySelector(".history-list")!.innerHTML).toBe("");
  });

  it("updateLastUpdated shows the correct time", () => {
    const lastUpdatedEl = document.querySelector("#lastUpdated");

    expect(lastUpdatedEl).not.toBeNull();
    expect(lastUpdatedEl!.textContent).toBe("Обновлено только что");

    jest.advanceTimersByTime(60000);
    expect(lastUpdatedEl!.textContent).toBe("Обновлено 1 минуту назад");

    jest.advanceTimersByTime(120000);
    expect(lastUpdatedEl!.textContent).toBe("Обновлено 3 минут назад");
  });

  it("should emit with city name when submit", () => {
    const emitSpy = jest.spyOn(eventBus, "emit");

    const input = document.querySelector(
      "#cityInput",
    ) as HTMLInputElement | null;
    const form = document.querySelector("#cityForm") as HTMLFormElement | null;

    expect(input).not.toBeNull();
    expect(form).not.toBeNull();

    input!.value = "Омск";

    input!.dispatchEvent(new Event("input", { bubbles: true }));
    form!.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    );

    expect(emitSpy).toHaveBeenCalledWith("weatherSubmit", "Омск");
  });

  it("should disabled submit button if input empty", () => {
    const input = document.querySelector(
      "#cityInput",
    ) as HTMLInputElement | null;
    const submitBtn = document.querySelector(
      "#submitButton",
    ) as HTMLButtonElement | null;

    expect(input).not.toBeNull();
    expect(submitBtn).not.toBeNull();

    input!.value = "";
    input!.dispatchEvent(new Event("input"));

    expect(submitBtn!.disabled).toBe(true);
  });
});
