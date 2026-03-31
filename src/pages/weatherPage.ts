import { SearchSectionView } from "../components/searchView";
import { WeatherInfoView } from "../components/weatherInfoView";
import { MapView } from "../components/mapView";
import { HistoryView } from "../components/historyView";
import { EventEmitter } from "../eventBus";
import { View } from "../data/view";

let currentViews: View[] = [];

export function renderWeatherPage(app: HTMLElement, eventBus: EventEmitter) {
  currentViews.forEach((view) => view.destroy?.());
  currentViews = [];

  const searchView = new SearchSectionView(eventBus);
  const weatherView = new WeatherInfoView(eventBus);
  const mapView = new MapView(eventBus);
  const historyView = new HistoryView(eventBus);

  currentViews.push(searchView, weatherView, mapView, historyView);

  app.innerHTML = `
        <main class="container">
            <!-- Search block -->
            <section class="search-section">
            </section>

            <!--Main block: info, map, history-->
            <div class="desktop-container">
            <!-- Main content - Weather and Map -->
            <div class="main-content">
                <section class="weather-section">
                </section>

                <!-- Map Display -->
                <section class="map-section">
                </section>
            </div>

            <!-- Sidebar - Search History -->
            <div class="sidebar">
                <!-- Search History -->
                <section class="history-section">
                </section>
            </div>
            </div>
        </main>
    `;

  const searchSection = app.querySelector(".search-section");
  if (!searchSection) throw new Error("Search section not found");
  searchSection.append(searchView.getElement());

  const weatherSection = app.querySelector(".weather-section");
  if (!weatherSection) throw new Error("Weather section not found");
  weatherSection.append(weatherView.getElement());

  const mapSection = app.querySelector(".map-section");
  if (!mapSection) throw new Error("Map section not found");
  mapSection.append(mapView.getElement());

  const historySection = app.querySelector(".history-section");
  if (!historySection) throw new Error("History section not found");
  historySection.append(historyView.getElement());
}
