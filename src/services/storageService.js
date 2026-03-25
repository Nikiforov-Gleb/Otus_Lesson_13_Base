import { DateFormatter } from "./dateFormatter.js";

export class StorageService {
  constructor(eventBus) {
    this.eventBus = eventBus;

    this.eventBus.on("weather:loaded", (weather) => {
      this.addItemHistory(weather);
    });

    this.eventBus.on("history:clear", () => {
      this.clearHistory();
    });
  }

  getHistory() {
    return JSON.parse(localStorage.getItem("searchHistory")) || [];
  }

  addItemHistory(weatherData) {
    const oldHistory = this.getHistory();
    const cityName = weatherData.name;

    const newItem = {
      name: weatherData.name,
      time: DateFormatter.getShortDateAndTime(),
      temp: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
    };

    const modifiedHistory = oldHistory.filter((item) => item.name !== cityName);
    modifiedHistory.unshift(newItem);
    const trimModifiedHistory = modifiedHistory.slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(trimModifiedHistory));

    this.eventBus.emit("history:updated", trimModifiedHistory);
    return trimModifiedHistory;
  }

  clearHistory() {
    localStorage.removeItem("searchHistory");
    this.eventBus.emit("history:updated", null);
  }
}
