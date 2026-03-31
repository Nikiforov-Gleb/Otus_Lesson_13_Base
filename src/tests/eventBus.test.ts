import { EventEmitter } from "../eventBus";

describe("EventEmitter", () => {
  let emitter: EventEmitter;

  const eventName = "weatherSubmit";
  const eventPayload = "Data";

  beforeEach(() => {
    emitter = new EventEmitter();
  });

  it("is a constructor", () => {
    expect(typeof EventEmitter).toBe("function");
    expect(new EventEmitter() instanceof EventEmitter).toBe(true);
  });

  it("has public methods", () => {
    expect(typeof emitter.on).toBe("function");
    expect(typeof emitter.off).toBe("function");
    expect(typeof emitter.emit).toBe("function");
  });

  it("should register and emit event", () => {
    const handler = jest.fn();

    emitter.on(eventName, handler);
    expect(handler).not.toHaveBeenCalled();
    emitter.emit(eventName, eventPayload);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(eventPayload);
  });

  it("should call multiple handlers for same event", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    emitter.on(eventName, handler1);
    emitter.on(eventName, handler2);

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();

    emitter.emit(eventName, eventPayload);

    expect(handler1).toHaveBeenCalledWith(eventPayload);
    expect(handler2).toHaveBeenCalledWith(eventPayload);
  });

  it("should unsubscribe from the events", () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();

    emitter.on(eventName, handler1);
    emitter.on(eventName, handler2);
    emitter.off(eventName, handler1);
    emitter.emit(eventName, eventPayload);

    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledWith(eventPayload);
  });
});
