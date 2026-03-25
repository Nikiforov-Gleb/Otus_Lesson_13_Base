import { LocationService } from "../services/locationService.js";

describe("Location Service", () => {
  let service;

  const position = {
    coords: {
      latitude: 52.52,
      longitude: 13.405,
    },
  };

  beforeEach(() => {
    service = new LocationService();

    global.navigator.geolocation = {
      getCurrentPosition: jest.fn(),
    };
  });

  it("should return position if geolocation request successful", async () => {
    navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
      success(position);
    });

    const result = await service.getCurrentPosition();
    expect(result).toBe(position);
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
  });

  it("should reject when geolocation fails", async () => {
    const geoError = new Error("Geolocation failed");
    navigator.geolocation.getCurrentPosition.mockImplementation(
      (success, error) => {
        error(geoError);
      },
    );

    await expect(service.getCurrentPosition()).rejects.toThrow(
      "Geolocation failed",
    );
    expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
  });
});
