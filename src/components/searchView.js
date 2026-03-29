export class SearchSectionView {
  constructor(eventBus) {
    this.eventBus = eventBus;

    this.root = document.createElement("div");
    this.root.className = "card";

    this.root.innerHTML = `
      <h2>Поиск</h2>
      <form id="cityForm">
        <div class="input-wrapper">
          <input
            type="text"
            id="cityInput"
            placeholder="Введите город"
            aria-label="Название города"
          />
          <button
            type="button"
            id="clearButton"
            class="clear-button"
            aria-label="Очистить ввод"
          >
            <i class="fas fa-times-circle"></i>
          </button>
        </div>
        <button type="submit" id="submitButton" class="btn-primary">
          Найти
        </button>
      </form>
    `;

    this.searchForm = this.root.querySelector("form");
    this.input = this.root.querySelector("#cityInput");
    this.submitBtn = this.root.querySelector("#submitButton");
    this.clearInputBtn = this.root.querySelector("#clearButton");

    this.submitBtn.disabled = true;

    this.onInput = () => {
      this.submitBtn.disabled = !this.input.value.trim();
    };

    this.onSubmit = (ev) => {
      ev.preventDefault();

      const formElement = ev.target;
      const inputEl = formElement.querySelector("input");
      const cityName = inputEl.value;

      this.eventBus.emit("weather:submit", cityName);
    };

    this.onClearInput = () => {
      this.input.value = "";
      this.submitBtn.disabled = true;
      this.input.focus();
    };

    this.input.addEventListener("input", this.onInput);
    this.searchForm.addEventListener("submit", this.onSubmit);
    this.clearInputBtn.addEventListener("click", this.onClearInput);
  }

  getElement() {
    return this.root;
  }

  destroy() {
    this.root.innerHTML = "";
    this.input.removeEventListener("input", this.onInput);
    this.searchForm.removeEventListener("submit", this.onSubmit);
    this.clearInputBtn.removeEventListener("click", this.onClearInput);
  }
}
