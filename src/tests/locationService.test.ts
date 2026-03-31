import { LocationService } from "../services/locationService";

describe("Location Service", () => {
  let service: LocationService;

  const position = {
    coords: {
      latitude: 52.52,
      longitude: 13.405,
    },
  } as GeolocationPosition;

  beforeEach(() => {
    service = new LocationService();

    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: jest.fn(),
      },
      configurable: true,
    });
  });

  it("should return position if geolocation request successful", async () => {
    const mock = navigator.geolocation
      .getCurrentPosition as jest.MockedFunction<
      typeof navigator.geolocation.getCurrentPosition
    >;

    mock.mockImplementation((success) => {
      success(position);
    });

    const result = await service.getCurrentPosition();
    expect(result).toBe(position);
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("should reject when geolocation fails", async () => {
    const mock = navigator.geolocation
      .getCurrentPosition as jest.MockedFunction<
      typeof navigator.geolocation.getCurrentPosition
    >;

    mock.mockImplementation((_success, error) => {
      if (error)
        error({
          code: 1,
          message: "Geolocation failed",
        } as GeolocationPositionError);
    });

    await expect(service.getCurrentPosition()).rejects.toThrow(
      "Geolocation failed",
    );
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
  });
});
