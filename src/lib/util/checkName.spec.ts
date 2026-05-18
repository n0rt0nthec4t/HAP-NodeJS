import { checkName } from "./checkName";

const warningMessage = (value: string): string =>
  "HAP-NodeJS WARNING: The accessory 'displayName' has an invalid 'Name' characteristic ('" + value +
  "'). Please ensure the name starts and ends with a letter or number. Only letters, numbers, spaces, apostrophes, " +
  "and common punctuation are supported. Avoid emojis or unsupported symbols. This may prevent the accessory from being added " +
  "in the Home App or cause unresponsiveness.";

describe("#checkName()", () => {
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  test("Accessory Name ending with !", async () => {
    checkName("displayName", "Name", "bad name!");

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(warningMessage("bad name!"));
  });

  test("Accessory Name beginning with !", async () => {
    checkName("displayName", "Name", "!bad name");

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(warningMessage("!bad name"));
  });

  test("Accessory Name containing !", async () => {
    checkName("displayName", "Name", "bad ! name");

    expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
  });

  test("Accessory Name beginning with '", async () => {
    checkName("displayName", "Name", " 'bad name");

    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    expect(consoleWarnSpy).toHaveBeenCalledWith(warningMessage(" 'bad name"));
  });

  test("Accessory Name containing '", async () => {
    checkName("displayName", "Name", "good ' name");

    expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
  });

  test("Accessory Name containing common punctuation", async () => {
    [
      "TV / Lounge",
      "Heating & Cooling",
      "Camera: Front Yard",
      "Rear (Garage) Door",
      "Fan_Light",
      "Zone-2",
      "Kitchen, Dining",
      "Room; Sensor",
    ].forEach(value => {
      checkName("displayName", "Name", value);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
      consoleWarnSpy.mockClear();
    });
  });

  test("Accessory Name ending with punctuation", async () => {
    [
      "TV /",
      "Heating &",
      "Camera:",
      "Garage Door)",
      "Fan_",
      "Zone-",
      "Kitchen,",
      "Room;",
    ].forEach(value => {
      checkName("displayName", "Name", value);

      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
      expect(consoleWarnSpy).toHaveBeenCalledWith(warningMessage(value));
      consoleWarnSpy.mockClear();
    });
  });
});
