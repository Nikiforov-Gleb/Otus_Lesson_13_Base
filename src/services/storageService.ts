import { DateFormatter } from "./dateFormatter";
import { EventEmitter } from "../eventBus";
import { WeatherData } from "../data/weatherData";
import { HistoryItem } from "../data/historyItem";

export class StorageService {
  private eventBus: EventEmitter;

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;

    this.eventBus.on("weatherLoaded", (weather: WeatherData) => {
      this.addItemHistory(weather);
    });

    this.eventBus.on("historyClear", () => {
      this.clearHistory();
    });
  }

  getHistory() {
    return JSON.parse(localStorage.getItem("searchHistory")!) || [];
  }

  addItemHistory(weatherData: WeatherData) {
    const oldHistory = this.getHistory();
    const cityName = weatherData.name;

    const newItem = {
      name: weatherData.name,
      time: DateFormatter.getShortDateAndTime(),
      temp: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
    };

    const modifiedHistory = oldHistory.filter(
      (item: HistoryItem) => item.name !== cityName,
    );
    modifiedHistory.unshift(newItem);
    const trimModifiedHistory = modifiedHistory.slice(0, 10);
    localStorage.setItem("searchHistory", JSON.stringify(trimModifiedHistory));

    this.eventBus.emit("historyUpdated", trimModifiedHistory);
    return trimModifiedHistory;
  }

  clearHistory() {
    localStorage.removeItem("searchHistory");
    this.eventBus.emit("historyUpdated", []);
  }
}
