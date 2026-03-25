export class HistoryView {
  constructor(eventBus) {
    this.eventBus = eventBus;

    this.historyListEl = document.querySelector(".history-list");
    this.historyItemtemplate = document.querySelector("#history-item-template");

    this.eventBus.on("history:updated", (weather) => {
      this.render(weather);
    });
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
}
