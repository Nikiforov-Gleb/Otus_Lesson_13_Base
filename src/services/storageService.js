import { DateFormatter } from "./dateFormatter.js";

export class StorageService {
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

    return trimModifiedHistory;
  }

  clearHistory() {
    localStorage.removeItem("searchHistory");
  }
}
