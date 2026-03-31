import { SearchSectionView } from "../components/searchView";
import { HistoryView } from "../components/historyView";
import { EventEmitter } from "../eventBus";

export function renderStartPage(app: HTMLElement, eventBus: EventEmitter) {
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

  const searchSection = app.querySelector(".search-section");
  if (!searchSection) throw new Error("Search section not found");
  searchSection.append(searchView.getElement());

  const historySection = app.querySelector(".history-section");
  if (!historySection) throw new Error("History section not found");
  historySection.append(historyView.getElement());
}
