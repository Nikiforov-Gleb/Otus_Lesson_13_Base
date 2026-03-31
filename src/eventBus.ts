import { AppEvents } from "./data/appEvents";

export class EventEmitter {
  private events: {
    [K in keyof AppEvents]?: Array<(data: AppEvents[K]) => void>;
  } = {};

  on<K extends keyof AppEvents>(
    event: K,
    handler: (data: AppEvents[K]) => void,
  ): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  off<K extends keyof AppEvents>(
    event: K,
    handler: (data: AppEvents[K]) => void,
  ): void {
    const handlers = this.events[event];
    if (!handlers) return;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  emit<K extends keyof AppEvents>(event: K, data: AppEvents[K]): void {
    if (!this.events[event]) return;
    this.events[event].forEach((handler) => handler(data));
  }
}
