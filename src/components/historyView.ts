import { EventEmitter } from "../eventBus";
import type { HistoryItem } from "../data/historyItem";
import type { View } from "../data/view";

export class HistoryView implements View {
  private eventBus: EventEmitter;
  private root: HTMLDivElement;
  private historyListEl: HTMLDivElement;
  private historyItemTemplate: HTMLTemplateElement;
  private clearHistoryBtn: HTMLButtonElement;

  private onClearHistory: () => void;
  private handlerRender = (history: HistoryItem[]) => this.render(history);

  constructor(eventBus: EventEmitter) {
    this.eventBus = eventBus;

    this.root = document.createElement("div");
    this.root.className = "card";

    this.root.innerHTML = `
        <div class="section-header">
          <h2>
            <i class="fas fa-history"></i>
            История поиска
          </h2>
        </div>

        <div class="history-container">
          <div class="history-list"></div>

          <template id="history-item-template">
            <div class="history-item">
              <div class="history-item-city">
                <div class="city-icon">
                  <i class="fa-solid fa-circle-dot"></i>
                </div>
                <div class="city-info">
                  <h3 class="city-name">Город</h3>
                  <p class="city-datetime">Дата, время</p>
                </div>
              </div>
              <div class="history-item-weather">
                <p class="weather-temp">0°C</p>
                <p class="weather-desc"></p>
              </div>
            </div>
          </template>

          <div class="history-actions">
            <button class="btn-secondary">
              <i class="fas fa-trash-alt"></i>
              Очистить историю
            </button>
          </div>
        </div>
    `;

    const historyListEl = this.root.querySelector(".history-list");
    if (!historyListEl) throw new Error("History list element not found");
    this.historyListEl = historyListEl as HTMLDivElement;

    const historyItemTemplate = this.root.querySelector(
      "#history-item-template",
    );
    if (!historyItemTemplate)
      throw new Error("History item template not found");
    this.historyItemTemplate = historyItemTemplate as HTMLTemplateElement;

    const clearHistoryBtn = this.root.querySelector(
      ".history-actions .btn-secondary",
    );
    if (!clearHistoryBtn) throw new Error("History clear button not found");
    this.clearHistoryBtn = clearHistoryBtn as HTMLButtonElement;

    this.onClearHistory = () => {
      eventBus.emit("historyClear", []);
    };
    this.clearHistoryBtn.addEventListener("click", this.onClearHistory);

    this.eventBus.on("historyUpdated", this.handlerRender);
  }

  getElement(): HTMLDivElement {
    return this.root;
  }

  render(history: HistoryItem[]) {
    this.historyListEl.innerHTML = "";

    history.forEach((item) => {
      const clone = this.historyItemTemplate.content.cloneNode(
        true,
      ) as DocumentFragment;

      clone.querySelector(".city-name")!.textContent = item.name;
      clone.querySelector(".city-datetime")!.textContent = item.time;
      clone.querySelector(".weather-temp")!.textContent = item.temp + "°C";
      clone.querySelector(".weather-desc")!.textContent = item.description;

      this.historyListEl.append(clone);
    });
  }

  destroy() {
    this.root.innerHTML = "";
    this.clearHistoryBtn.removeEventListener("click", this.onClearHistory);
    this.eventBus.off("historyUpdated", this.handlerRender);
  }
}
