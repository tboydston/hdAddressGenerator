const fs = require("fs");
const path = require("path");
const settings = require("./settings");

const coins = fs.readdirSync(path.join(__dirname, "coins"));
const Gen = require("../hdAddressGenerator");

const coinData = {};

if (settings.testCoin === "ALL") {
  coins.forEach((coin) => {
    const coinName = coin.split(".")[0];
    coinData[coinName] = {};
    coinData[coinName] = require(`./coins/${coin}`);
  });
} else {
  const coinName = settings.testCoin;
  coinData[coinName] = {};
  coinData[coinName] = require(`./coins/${coinName}`);
}

for (const coin in coinData) {
  const ref = coinData[coin];

  describe(`${ref.longName} (${ref.shortName})`, () => {
    let bip44 = false;
    let bip44WithPassPhrase = false;
    let bip44Hardened = false;
    let bip44Encrypted = false;
    let bip44seed = false;
    let bip49 = false;
    let bip49Encrypted = false;
    let bip84 = false;
    let bip32 = false;
    let bip32seed = false;
    let bip141 = false;
    let bip141seed = false;
    let withExtPub44 = false;
    let withExtPub49 = false;
    let withExtPub84 = false;
    let withExtPub44Internal = false;

    try {
      bip44 = Gen.withMnemonic(settings.mnemonic, false, ref.shortName);
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip44WithPassPhrase = Gen.withMnemonic(
        settings.mnemonic,
        settings.passphrase,
        ref.shortName,
        false
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip44Hardened = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        true
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip44Encrypted = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        false,
        44,
        0,
        0,
        settings.bip38Password
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip44seed = Gen.withSeed(settings.bip32Seed, ref.shortName);
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip49 = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        false,
        49
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip49Encrypted = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        false,
        49,
        0,
        0,
        settings.bip38Password
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip84 = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        false,
        84
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip32 = Gen.withMnemonicBIP32(
        settings.mnemonic,
        false,
        ref.shortName,
        "m/0'/0'",
        false
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip32seed = Gen.withSeedBIP32(
        settings.bip32Seed,
        ref.shortName,
        "m/0'/0'",
        false
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip141 = Gen.withMnemonicBIP141(
        settings.mnemonic,
        false,
        ref.shortName,
        "m/0'/0'",
        "p2wpkhInP2sh"
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      bip141seed = Gen.withSeedBIP141(
        settings.bip32Seed,
        ref.shortName,
        "m/0'/0'",
        "p2wpkhInP2sh"
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      withExtPub44 = Gen.withExtPub(ref.bip44AccountExtPubKey, ref.shortName);
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      withExtPub44Internal = Gen.withExtPub(
        ref.bip44AccountExtPubKey,
        ref.shortName,
        44,
        0,
        1
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      withExtPub49 = Gen.withExtPub(
        ref.bip49AccountExtPubKey,
        ref.shortName,
        49
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }
    try {
      withExtPub84 = Gen.withExtPub(
        ref.bip84AccountExtPubKey,
        ref.shortName,
        84
      );
    } catch {
      // Not every coin supports every derivation; unsupported ones are skipped below.
    }

    // Test root Keys
    if (ref.bip32RootKeyBip44 != undefined) {
      it("Expect bip32RootKeyBip44 to match reference.", () => {
        expect(bip44.bip32RootKey).toBe(ref.bip32RootKeyBip44);
      });
    }
    if (ref.bip32RootKeyBip49 != undefined) {
      it("Expect bip32RootKeyBip49 to match reference.", () => {
        expect(bip49.bip32RootKey).toBe(ref.bip32RootKeyBip49);
      });
    }
    if (ref.bip32RootKeyBip84 != undefined) {
      it("Expect bip32RootKeyBip84 to match reference.", () => {
        expect(bip84.bip32RootKey).toBe(ref.bip32RootKeyBip84);
      });
    }
    if (ref.bip32RootKeyBip44WithPassphrase != undefined) {
      it("Expect bip32RootKeyBip44 to match reference when passphrase used.", () => {
        expect(bip44WithPassPhrase.bip32RootKey).toBe(
          ref.bip32RootKeyBip44WithPassphrase
        );
      });
    }
    if (ref.bip32RootKeyBip49 != undefined) {
      it("Expect bip32RootKeyBip141 to match reference.", () => {
        expect(bip141.bip32RootKey).toBe(ref.bip32RootKeyBip49);
      });
    }

    // Test extended pub key as this generally requires all previous keys to be accurate.
    if (ref.bip32ExtPubKeyBip44 != undefined) {
      it("Expect bip32ExtPubKeyBip44 to match reference.", () => {
        expect(bip44.bip32XpubKey).toBe(ref.bip32ExtPubKeyBip44);
      });
    }
    if (ref.bip32ExtPubKeyBip49 != undefined) {
      it("Expect bip32ExtPubKeyBip49 to match reference.", () => {
        expect(bip49.bip32XpubKey).toBe(ref.bip32ExtPubKeyBip49);
      });
    }
    if (ref.bip32ExtPubKeyBip84 != undefined) {
      it("Expect bip32ExtPubKeyBip84 to match reference.", () => {
        expect(bip84.bip32XpubKey).toBe(ref.bip32ExtPubKeyBip84);
      });
    }

    // Test address generation.
    if (
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined
    ) {
      it("Expect addressBip44index0 and addressBip44index1 address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip44.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip44index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip44index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip44index0);
        expect(addresses[1].address).toBe(ref.addressBip44index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip44index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip44index1);
      });
    }

    if (
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined &&
      bip44seed != false
    ) {
      it("Expect addressBip44index0 and addressBip44index1 address when generated with seed, pub, and priv keys to match reference.", async () => {
        const addresses = await bip44seed.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip44index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip44index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip44index0);
        expect(addresses[1].address).toBe(ref.addressBip44index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip44index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip44index1);
      });
    }

    if (ref.addressBip44HardIndex0 != undefined) {
      it("Expect addressBip44HardIndex0 hardened address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip44Hardened.generate(1);

        expect(addresses[0].address).toBe(ref.addressBip44HardIndex0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip44HardIndex0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip44HardIndex0);
      });
    }

    if (ref.addressBip44EncryptedIndex0 != undefined) {
      it("Expect bip44Encrypted encrypted address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip44Encrypted.generate(1);

        expect(addresses[0].address).toBe(ref.addressBip44EncryptedIndex0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip44EncryptedIndex0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip44EncryptedIndex0);
      }, 30000);
    }

    if (
      ref.addressBip49index0 != undefined &&
      ref.addressBip49index1 != undefined
    ) {
      it("Expect addressBip49index0 and addressBip49index1 address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip49.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip49index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip49index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip49index0);
        expect(addresses[1].address).toBe(ref.addressBip49index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip49index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip49index1);
      });
    }

    if (ref.addressBip49EncryptedIndex0 != undefined) {
      it("Expect bip49Encrypted encrypted address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip49Encrypted.generate(1);

        expect(addresses[0].address).toBe(ref.addressBip49EncryptedIndex0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip49EncryptedIndex0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip49EncryptedIndex0);
      }, 30000);
    }

    if (
      ref.addressBip84index0 != undefined &&
      ref.addressBip84index1 != undefined
    ) {
      it("Expect addressBip84index0 and addressBip84index1 address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip84.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip84index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip84index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip84index0);
        expect(addresses[1].address).toBe(ref.addressBip84index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip84index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip84index1);
      });
    }

    if (
      ref.addressBip32index0 != undefined &&
      ref.addressBip32index1 != undefined
    ) {
      it("Expect addressBip32index0 and addressBip32index1 address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip32.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip32index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip32index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip32index0);
        expect(addresses[1].address).toBe(ref.addressBip32index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip32index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip32index1);
      });
    }

    if (
      ref.addressBip32index0 != undefined &&
      ref.addressBip32index1 != undefined &&
      bip32seed != false
    ) {
      it("Expect addressBip32index0 and addressBip32index1 address with seed instead of mnemonic, pub, and priv keys to match reference.", async () => {
        const addresses = await bip32seed.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip32index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip32index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip32index0);
        expect(addresses[1].address).toBe(ref.addressBip32index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip32index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip32index1);
      });
    }

    if (
      ref.addressBip141index0 != undefined &&
      ref.addressBip141index1 != undefined
    ) {
      it("Expect addressBip141index0 and addressBip141index1 address, pub, and priv keys to match reference.", async () => {
        const addresses = await bip141.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip141index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip141index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip141index0);
        expect(addresses[1].address).toBe(ref.addressBip141index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip141index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip141index1);
      });
    }

    if (
      ref.addressBip141index0 != undefined &&
      ref.addressBip141index1 != undefined &&
      bip141seed != false
    ) {
      it("Expect addressBip141index0 and addressBip141index1 address with seed instead of mnemonic, pub, and priv keys to match reference.", async () => {
        const addresses = await bip141seed.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip141index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip141index0);
        expect(addresses[0].privKey).toBe(ref.privKeyBip141index0);
        expect(addresses[1].address).toBe(ref.addressBip141index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip141index1);
        expect(addresses[1].privKey).toBe(ref.privKeyBip141index1);
      });
    }

    if (
      ref.bip44AccountExtPubKey !== undefined &&
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined
    ) {
      it("Expect extPub generated address addressBip44index0 and addressBip44index1 address and pub keys to match reference.", async () => {
        const addresses = await withExtPub44.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip44index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip44index0);
        expect(addresses[0].privKey).toBe("");
        expect(addresses[1].address).toBe(ref.addressBip44index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip44index1);
        expect(addresses[1].privKey).toBe("");
      });
    }

    if (
      ref.bip44AccountExtPubKey !== undefined &&
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined &&
      ref.shortName == "BTC"
    ) {
      it("Expect extPub generated address using internal option ( i.e. m/44'/0'/0'/1/0 ) with addressBip44index0 and addressBip44index1 address and pub keys to match reference.", async () => {
        const addresses = await withExtPub44Internal.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip44index0Internal);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip44index0Internal);
        expect(addresses[0].privKey).toBe("");
        expect(addresses[1].address).toBe(ref.addressBip44index1Internal);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip44index1Internal);
        expect(addresses[1].privKey).toBe("");
      });
    }

    if (
      ref.bip49AccountExtPubKey !== undefined &&
      ref.addressBip49index0 != undefined &&
      ref.addressBip49index1 != undefined
    ) {
      it("Expect extPub generated address addressBip49index0 and addressBip49index1 address and pub keys to match reference.", async () => {
        const addresses = await withExtPub49.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip49index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip49index0);
        expect(addresses[0].privKey).toBe("");
        expect(addresses[1].address).toBe(ref.addressBip49index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip49index1);
        expect(addresses[1].privKey).toBe("");
      });
    }

    if (
      ref.bip84AccountExtPubKey !== undefined &&
      ref.addressBip84index0 != undefined &&
      ref.addressBip84index1 != undefined
    ) {
      it("Expect extPub generated address addressBip84index0 and addressBip84index1 address and pub keys to match reference.", async () => {
        const addresses = await withExtPub84.generate(2);

        expect(addresses[0].address).toBe(ref.addressBip84index0);
        expect(addresses[0].pubKey).toBe(ref.pubKeyBip84index0);
        expect(addresses[0].privKey).toBe("");
        expect(addresses[1].address).toBe(ref.addressBip84index1);
        expect(addresses[1].pubKey).toBe(ref.pubKeyBip84index1);
        expect(addresses[1].privKey).toBe("");
      });
    }
  });
}
