import { WeatherView } from "../view/weatherView";
import fs from "fs";
import path from "path";

jest.mock("../services/dateFormatter.js", () => ({
  DateFormatter: {
    getLongDate: jest.fn(() => "24.03.2026 11:45"),
  },
}));

function setupDOM() {
  const html = fs.readFileSync(
    path.resolve(__dirname, "../pages/weather.html"),
    "utf8",
  );

  document.documentElement.innerHTML = html;
}

describe("Weather view", () => {
  let view;

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
  };

  beforeEach(() => {
    setupDOM();
    view = new WeatherView();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("should correctly render weather info", () => {
    view.renderWeather(weatherData);

    expect(document.querySelector("#cityName").textContent).toBe("Москва");
    expect(document.querySelector(".temperature").textContent).toBe("5°C");
    expect(document.querySelector(".weather-description").textContent).toBe(
      "Облачно",
    );
    expect(document.querySelector("[data-wind]").textContent).toBe("5 м/с");
    expect(document.querySelector("[humid]").textContent).toBe("80%");
    expect(document.querySelector("[pressure]").textContent).toBe("1012 Па");

    expect(document.querySelector("#currentDateTime").textContent).toBe(
      "24.03.2026 11:45",
    );
    expect(document.querySelector("#lastUpdated").textContent).toContain(
      "Обновлено",
    );
  });

  it("should correctly render map", async () => {
    await view.renderMap("Москва", 55, 37);

    const img = document.querySelector(".map-container img");

    expect(img.src).toContain("ll=37,55");
    expect(img.alt).toBe("Карта Москва");
  });

  it("should correctly render history", async () => {
    const history = [
      {
        name: "Москва",
        time: "11:45",
        temp: 5,
        description: "Облачно",
      },
    ];

    view.renderHistory(history);

    const item = document.querySelector(".history-item");
    expect(item).not.toBeNull();
    expect(item.querySelector(".city-name").textContent).toBe("Москва");
    expect(item.querySelector(".weather-temp").textContent).toBe("5°C");
    expect(item.querySelector(".weather-desc").textContent).toBe("Облачно");
    expect(item.querySelector(".city-datetime").textContent).toBe("11:45");
  });

  it("clearHistory should  removes all items", () => {
    document.querySelector(".history-list").innerHTML = "<li>test</li>";
    view.clearHistory();

    expect(document.querySelector(".history-list").innerHTML).toBe("");
  });

  it("updateLastUpdated shows the correct time", () => {
    const el = document.querySelector("#lastUpdated");

    const twoMinutesAgo = new Date(Date.now() - 2 * 60000);
    view.updateLastUpdated(twoMinutesAgo);
    expect(el.textContent).toBe("Обновлено 2 минут назад");

    const oneMinuteAgo = new Date(Date.now() - 60000);
    view.updateLastUpdated(oneMinuteAgo);
    expect(el.textContent).toBe("Обновлено 1 минуту назад");

    const now = new Date();
    view.updateLastUpdated(now);
    expect(el.textContent).toBe("Обновлено только что");
  });
});
