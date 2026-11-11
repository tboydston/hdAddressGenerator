const settings = require("./settings");

const Gen = require("../hdAddressGenerator");

describe("bip39seed", () => {
  it("Expect bip32Seed to match reference in settings.", () => {
    const gen = Gen.withMnemonic(settings.mnemonic, false, "BTC");

    expect(gen.bip32Seed).toBe(settings.bip32Seed);
  });
});
