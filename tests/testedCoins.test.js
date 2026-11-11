const fs = require("fs");
const path = require("path");
const settings = require("./settings");

const Gen = require("../hdAddressGenerator");

describe("Tested coin list", () => {
  afterEach(() => {
    Gen.warnOnUntestedCoin = false;
    jest.restoreAllMocks();
  });

  it("Expect testedCoins to match the reference files in tests/coins.", () => {
    const files = fs
      .readdirSync(path.join(__dirname, "coins"))
      .map((file) => path.basename(file, ".js"))
      .sort();

    expect([...Gen.testedCoins].sort()).toEqual(files);
  });

  it("Expect coinHasTest to report tested and untested coins.", () => {
    expect(Gen.coinHasTest("BTC")).toBe(true);
    expect(Gen.coinHasTest("DOGE")).toBe(false);
  });

  it("Expect no warning for an untested coin by default.", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

    Gen.withSeed(settings.bip32Seed, "DOGE");

    expect(warn).not.toHaveBeenCalled();
  });

  it("Expect a warning only for untested coins once warnOnUntestedCoin is enabled.", () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    Gen.warnOnUntestedCoin = true;

    Gen.withSeed(settings.bip32Seed, "BTC");

    expect(warn).not.toHaveBeenCalled();

    Gen.withSeed(settings.bip32Seed, "DOGE");

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("DOGE has no test");
  });
});
