import { View } from "../data/view";
import { EventEmitter } from "../eventBus";

export class SearchSectionView implements View {
  private eventBus: EventEmitter;
  private root: HTMLDivElement;
  private searchForm: HTMLFormElement;
  private input: HTMLInputElement;
  private submitBtn: HTMLButtonElement;
  private clearInputBtn: HTMLButtonElement;

  private onInput = () => {
    this.submitBtn.disabled = !this.input.value.trim();
  };
  private onSubmit = (ev: Event) => {
    ev.preventDefault();
    const formElement = ev.target! as HTMLFormElement;
    const inputEl = formElement.querySelector("input")!;
    const cityName = inputEl.value;

    this.eventBus.emit("weatherSubmit", cityName);
    this.onClearInput();
  };
  private onClearInput = () => {
    this.input.value = "";
    this.submitBtn.disabled = true;
    this.input.focus();
  };

  constructor(eventBus: EventEmitter) {
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

    const searchForm = this.root.querySelector("form");
    if (!searchForm) throw new Error("Search form not found");
    this.searchForm = searchForm;

    const input = this.root.querySelector("#cityInput");
    if (!input) throw new Error("Search input not found");
    this.input = input as HTMLInputElement;

    const submitBtn = this.root.querySelector("#submitButton");
    if (!submitBtn) throw new Error("Submit button not found");
    this.submitBtn = submitBtn as HTMLButtonElement;

    const clearInputBtn = this.root.querySelector("#clearButton");
    if (!clearInputBtn) throw new Error("Clear input button not found");
    this.clearInputBtn = clearInputBtn as HTMLButtonElement;

    this.submitBtn.disabled = true;

    this.input.addEventListener("input", this.onInput);
    this.searchForm.addEventListener("submit", this.onSubmit);
    this.clearInputBtn.addEventListener("click", this.onClearInput);
  }

  getElement(): HTMLDivElement {
    return this.root;
  }

  destroy() {
    this.root.innerHTML = "";
    this.input.removeEventListener("input", this.onInput);
    this.searchForm.removeEventListener("submit", this.onSubmit);
    this.clearInputBtn.removeEventListener("click", this.onClearInput);
  }
}
