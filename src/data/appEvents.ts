import { WeatherData } from "./weatherData";
import { HistoryItem } from "./historyItem";

export interface AppEvents {
  weatherLoaded: WeatherData;
  weatherSubmit: string;
  historyUpdated: HistoryItem[];
  historyClear: [];
}
