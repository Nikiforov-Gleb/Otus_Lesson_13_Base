import type { WeatherData } from "../data/weatherData.ts";

export class WeatherService {
  apiKey = "c722da73a7894ccbda8169bd7d4e9dc2";

  async getWeatherByCityName(cityName: string) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&q=${cityName}&appid=${this.apiKey}`,
    );
    return await response.json();
  }

  async getWeatherByGeolocation(latitude: number, longitude: number) {
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?units=metric&lang=ru&lat=${latitude}&lon=${longitude}&appid=${this.apiKey}`,
    );
    const weatherData = await weatherResponse.json();
    const geoResponse = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${this.apiKey}`,
    );
    const geoData = await geoResponse.json();

    if (geoData[0]?.local_names?.ru) {
      weatherData.name = geoData[0].local_names.ru;
    }

    return weatherData as WeatherData;
  }
}
