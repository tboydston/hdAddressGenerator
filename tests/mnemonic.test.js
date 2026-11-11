const settings = require("./settings");

const Gen = require("../hdAddressGenerator");

describe("Mnemonic validation", () => {
  it("Expect the reference mnemonic to be valid.", () => {
    expect(Gen.validateMnemonic(settings.mnemonic)).toBe(true);
  });

  it("Expect a generated mnemonic in every supported wordlist to be valid.", async () => {
    const wordlists = Gen.getSupportedWordLists();

    expect(wordlists).toContain("english");

    const results = await Promise.all(
      wordlists.map((wordlist) => Gen.generateMnemonic(wordlist))
    );

    results.forEach((result) => {
      expect(Gen.validateMnemonic(result.mnemonic)).toBe(true);
    });
  });

  it("Expect unknown words, a bad checksum, and non-strings to be invalid.", () => {
    const words = settings.mnemonic.split(" ");
    const badChecksum = [...words.slice(0, -1), "zoo"].join(" ");

    expect(Gen.validateMnemonic("not a valid mnemonic at all")).toBe(false);
    expect(Gen.validateMnemonic(badChecksum)).toBe(false);
    expect(Gen.validateMnemonic(false)).toBe(false);
  });

  it("Expect an invalid mnemonic to be rejected with and without a passphrase.", () => {
    const message = "Invalid BIP39 mnemonic";

    expect(() =>
      Gen.withMnemonic("not a valid mnemonic", false, "BTC")
    ).toThrow(message);
    expect(() =>
      Gen.withMnemonic("not a valid mnemonic", settings.passphrase, "BTC")
    ).toThrow(message);
    expect(() =>
      Gen.withMnemonicBIP32("not a valid mnemonic", false, "BTC", "m/0'/0'")
    ).toThrow(message);
  });

  it("Expect a seed or an extended public key to need no mnemonic.", () => {
    const xpub = Gen.withMnemonic(
      settings.mnemonic,
      false,
      "BTC"
    ).accountXpubKey;

    expect(() => Gen.withSeed(settings.bip32Seed, "BTC")).not.toThrow();
    expect(() => Gen.withExtPub(xpub, "BTC")).not.toThrow();
  });
});
