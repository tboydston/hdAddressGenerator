const settings = require("./settings");

const Gen = require("../hdAddressGenerator");

const cashAddress = "bitcoincash:qpp88hghht87tvnu5gwf2qnrdcw580hf6cyl07g4z8";
const bitPayAddress = "CNXFy3oa8eUjW3AwMwmpJX4PsEcogf953Z";
const slpAddress = "simpleledger:qqrdkgy7cevz3tgj7w5nlwakhs24twkexsrxvulr5x";

describe("Address Conversion", () => {
  let bchAddresses;
  let slpAddresses;

  beforeAll(async () => {
    bchAddresses = await Gen.withMnemonic(
      settings.mnemonic,
      false,
      "BCH"
    ).generate(1);
    slpAddresses = await Gen.withMnemonic(
      settings.mnemonic,
      false,
      "SLP"
    ).generate(1);
  });

  it("Expect legacy address conversion to CashAddr to match reference", () => {
    expect(Gen.convertAddress(bchAddresses[0].address, "cashAddress")).toBe(
      cashAddress
    );
  });

  it("Expect legacy address conversion to BitPay to match reference", () => {
    expect(Gen.convertAddress(bchAddresses[0].address, "bitpayAddress")).toBe(
      bitPayAddress
    );
  });

  it("Expect legacy address conversion to BCH SLP to match reference", () => {
    expect(Gen.convertAddress(slpAddresses[0].address, "bchSlp")).toBe(
      slpAddress
    );
  });

  it("Expect an unknown format to throw", () => {
    expect(() => Gen.convertAddress(bchAddresses[0].address, "nope")).toThrow(
      "Address format nope does not exist."
    );
  });
});
