export class MapView {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.mapEl = document.querySelector(".map-container");

    this.eventBus.on("weather:loaded", (weather) => {
      this.render(weather);
    });
  }

  render(weather) {
    const { name, coord } = weather;
    const { lat, lon } = coord;

    const mapUrl = `https://static-maps.yandex.ru/v1?ll=${lon},${lat}&z=12&l=map&pt=${lon},${lat},pm2rdm&lang=ru_RU&size=450,450&apikey=2e0af910-8693-4179-a540-f192dfc6967f`;
    const img = this.mapEl.querySelector("img");
    img.src = mapUrl;
    img.alt = `Карта ${name}`;
  }
}
