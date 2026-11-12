const Gen = require("../hdAddressGenerator");
const settings = require("./settings");

/**
 * Coins that are in the coin list but that this library cannot generate addresses for.
 * They must fail with a clear error instead of returning a result with no address.
 */

const unsupportedCoins = ["GRS", "GRSt", "ELA", "NAS"];

describe("Unsupported coins", () => {
  it.each(unsupportedCoins)(
    "Expect %s to be rejected with a clear error.",
    (coin) => {
      expect(() => Gen.withSeed(settings.bip32Seed, coin)).toThrow(
        `${coin} is not supported at this time.`
      );
    }
  );
});
