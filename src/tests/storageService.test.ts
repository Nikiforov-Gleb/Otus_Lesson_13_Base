import { StorageService } from "../services/storageService";
import { DateFormatter } from "../services/dateFormatter";
import { EventEmitter } from "../eventBus";
import { WeatherData } from "../data/weatherData";
import { HistoryItem } from "../data/historyItem";

jest.mock("../services/dateFormatter", () => ({
  DateFormatter: {
    getShortDateAndTime: jest.fn(),
  },
}));

describe("Storage Service", () => {
  let emitter: EventEmitter;
  let service: StorageService;
  (DateFormatter.getShortDateAndTime as jest.Mock).mockReturnValue(
    "24 мар., 09:21",
  );

  const weatherData = {
    name: "Москва",
    main: {
      temp: 5,
    },
    weather: [
      {
        description: "Облачно",
      },
    ],
  } as WeatherData;

  beforeEach(() => {
    emitter = new EventEmitter();
    service = new StorageService(emitter);
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get History", () => {
    it("should return empty array, if localStorage empty", () => {
      const result = service.getHistory();
      expect(result).toEqual([]);
    });

    it("should return history from localStorage", () => {
      const history = [weatherData];
      localStorage.setItem("searchHistory", JSON.stringify(history));

      const result = service.getHistory();

      expect(result[0]).toEqual(weatherData);
    });
  });

  describe("Add Item History", () => {
    it("should add new item", () => {
      const result = service.addItemHistory(weatherData);

      expect(result.length).toBe(1);
      expect(result[0]).toEqual({
        name: "Москва",
        time: "24 мар., 09:21",
        temp: 5,
        description: "Облачно",
      });

      const history = service.getHistory();

      expect(history[0]).toEqual({
        name: "Москва",
        time: "24 мар., 09:21",
        temp: 5,
        description: "Облачно",
      });
    });

    it("should remove duplicates by city name", () => {
      const history = [
        { name: "Москва", temp: 10 },
        { name: "Тверь", temp: 15 },
      ];
      localStorage.setItem("searchHistory", JSON.stringify(history));

      const result = service.addItemHistory(weatherData);

      expect(result.length).toBe(2);
      expect(result[0].name).toBe("Москва");
      expect(
        result.filter((item: HistoryItem) => item.name === "Москва").length,
      ).toBe(1);
    });

    it("should max ten items in array", () => {
      const history = Array.from({ length: 10 }, (_, i) => ({
        name: `City${i}`,
      }));

      localStorage.setItem("searchHistory", JSON.stringify(history));

      const result = service.addItemHistory(weatherData);

      expect(result.length).toBe(10);
    });
  });

  describe("Clear History", () => {
    it("Should remove data from localStorage", () => {
      service.addItemHistory(weatherData);
      service.clearHistory();

      const result = service.getHistory();
      expect(result).toEqual([]);
    });
  });
});
