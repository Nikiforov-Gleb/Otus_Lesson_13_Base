import { SearchSectionView } from "../components/searchView";
import { HistoryView } from "../components/historyView";

export function renderStartPage(app, eventBus) {
  const searchView = new SearchSectionView(eventBus);
  const historyView = new HistoryView(eventBus);

  app.innerHTML = `
        <main class="container">
            <!-- Search block -->
            <section class="search-section">
            </section>
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
  app.querySelector(".history-section").append(historyView.getElement());
}
