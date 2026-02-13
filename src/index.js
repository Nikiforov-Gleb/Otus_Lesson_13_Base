import "./css/styles.css";

(async function () {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      () => {
        //position
        window.location.href = "weather.html";
      },
      () => {
        //error
        init();
      },
    );
  } else {
    init();
  }
})();

function init() {
  const searchForm = document.querySelector("form");
  const input = document.querySelector("#cityInput");
  const submitButton = document.querySelector("#submitButton");
  const clearButton = document.querySelector("#clearButton");

  input.addEventListener("input", () => {
    submitButton.disabled = !input.value.trim();
  });

  clearButton.addEventListener("click", () => {
    input.value = "";
    submitButton.disabled = true;
    input.focus();
  });

  searchForm.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const formElement = ev.target;
    const inputEl = formElement.querySelector("input");
    const cityName = inputEl.value;

    window.location.href = `weather.html?city=${encodeURIComponent(cityName)}`;
  });
}
