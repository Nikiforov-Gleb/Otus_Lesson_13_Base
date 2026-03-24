import { WeatherService } from "../services/weatherService";

global.fetch = jest.fn();

describe("WeatherService", () => {
  let service;

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
  };

  beforeEach(() => {
    service = new WeatherService();
    fetch.mockClear();
  });

  it("should fetch weather by city and return json", async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(weatherData),
    });

    const result = await service.getWeatherByCityName("Москва");

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("q=Москва"));

    expect(result).toEqual(weatherData);
  });

  it("should fetch weather by geolocation and return json with Russian name", async () => {
    const weatherDataWithWrongName = {
      name: "Ulyanka",
      main: {
        temp: 5,
      },
      weather: [
        {
          description: "Облачно",
        },
      ],
    };
    const geoData = [
      {
        local_names: {
          ru: "Санкт-Петербург",
        },
      },
    ];

    fetch
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(weatherDataWithWrongName),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(geoData),
      });

    const result = await service.getWeatherByGeolocation(55, 37);

    expect(fetch).toHaveBeenCalledTimes(2);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("lat=55&lon=37"),
    );

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("geo/1.0/reverse"),
    );

    expect(result.name).toBe("Санкт-Петербург");
    expect(result.main.temp).toBe(5);
  });
});
