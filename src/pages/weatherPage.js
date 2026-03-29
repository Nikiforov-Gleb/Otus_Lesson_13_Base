import { SearchSectionView } from "../components/searchView";
import { WeatherInfoView } from "../components/weatherInfoView";
import { MapView } from "../components/mapView";
import { HistoryView } from "../components/historyView";

let currentViews = [];

export function renderWeatherPage(app, eventBus) {
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

  app.querySelector(".search-section").append(searchView.getElement());
  app.querySelector(".weather-section").append(weatherView.getElement());
  app.querySelector(".map-section").append(mapView.getElement());
  app.querySelector(".history-section").append(historyView.getElement());
}
