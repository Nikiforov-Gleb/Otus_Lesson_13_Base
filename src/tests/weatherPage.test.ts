import { EventEmitter } from "../eventBus";
import { renderWeatherPage } from "../pages/weatherPage";

jest.mock("../services/dateFormatter.ts", () => ({
  DateFormatter: {
    getLongDate: jest.fn(() => "24.03.2026 11:45"),
  },
}));

describe("renderWeatherPage extra coverage", () => {
  let app: HTMLElement;
  let eventBus: EventEmitter;

  beforeEach(() => {
    app = document.createElement("div");
    eventBus = new EventEmitter();
  });

  it("should throw error if a section is missing", () => {
    renderWeatherPage(app, eventBus);

    const originalQuerySelector = app.querySelector.bind(app);
    app.querySelector = (selector: string) => {
      if (selector === ".search-section") return null;
      return originalQuerySelector(selector);
    };

    expect(() => renderWeatherPage(app, eventBus)).toThrow(
      "Search section not found",
    );
  });

  it("should append all views to correct sections", () => {
    renderWeatherPage(app, eventBus);

    const searchSection = app.querySelector(".search-section");
    const weatherSection = app.querySelector(".weather-section");
    const mapSection = app.querySelector(".map-section");
    const historySection = app.querySelector(".history-section");

    expect(searchSection).not.toBeNull();
    expect(weatherSection).not.toBeNull();
    expect(mapSection).not.toBeNull();
    expect(historySection).not.toBeNull();

    expect(searchSection!.children.length).toBe(1);
    expect(weatherSection!.children.length).toBe(1);
    expect(mapSection!.children.length).toBe(1);
    expect(historySection!.children.length).toBe(1);
  });
});
