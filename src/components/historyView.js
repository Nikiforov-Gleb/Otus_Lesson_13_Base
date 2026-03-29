export class HistoryView {
  constructor(eventBus) {
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

    this.historyListEl = this.root.querySelector(".history-list");
    this.historyItemtemplate = this.root.querySelector(
      "#history-item-template",
    );
    this.clearHistoryBtn = this.root.querySelector(
      ".history-actions .btn-secondary",
    );

    this.onClearHistory = () => {
      eventBus.emit("history:clear");
    };
    this.clearHistoryBtn.addEventListener("click", this.onClearHistory);

    this.handlerRender = (weather) => this.render(weather);
    this.eventBus.on("history:updated", this.handlerRender);
  }

  getElement() {
    return this.root;
  }

  render(history) {
    this.historyListEl.innerHTML = "";

    if (!history) return;

    history.forEach((item) => {
      const clone = this.historyItemtemplate.content.cloneNode(true);

      clone.querySelector(".city-name").textContent = item.name;
      clone.querySelector(".city-datetime").textContent = item.time;
      clone.querySelector(".weather-temp").textContent = item.temp + "°C";
      clone.querySelector(".weather-desc").textContent = item.description;

      this.historyListEl.append(clone);
    });
  }

  destroy() {
    this.root.innerHTML = "";
    this.clearHistoryBtn.removeEventListener("click", this.onClearHistory);
    this.eventBus.off("history:updated", this.handlerRender);
  }
}
