const assert = require("assert");
const fs = require("fs");
const settings = require("./settings");

const coins = fs.readdirSync("tests/coins");
const Gen = require("../hdAddressGenerator");

const coinData = {};

if (settings.testCoin === "ALL") {
  coins.forEach((coin) => {
    const coinName = coin.split(".")[0];
    coinData[coinName] = {};
    coinData[coinName] = require(`./coins/${coin}`);
  });
} else {
  coinName = settings.testCoin;
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
    } catch (e) {}
    try {
      bip44WithPassPhrase = Gen.withMnemonic(
        settings.mnemonic,
        settings.passphrase,
        ref.shortName,
        false
      );
    } catch (e) {}
    try {
      bip44Hardened = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        true
      );
    } catch (e) {}
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
    } catch (e) {}
    try {
      bip44seed = Gen.withSeed(settings.bip32Seed, ref.shortName);
    } catch (e) {}
    try {
      bip49 = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        false,
        49
      );
    } catch (e) {}
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
    } catch (e) {}
    try {
      bip84 = Gen.withMnemonic(
        settings.mnemonic,
        false,
        ref.shortName,
        false,
        84
      );
    } catch (e) {}
    try {
      bip32 = Gen.withMnemonicBIP32(
        settings.mnemonic,
        false,
        ref.shortName,
        "m/0'/0'",
        false
      );
    } catch (e) {}
    try {
      bip32seed = Gen.withSeedBIP32(
        settings.bip32Seed,
        ref.shortName,
        "m/0'/0'",
        false
      );
    } catch (e) {}
    try {
      bip141 = Gen.withMnemonicBIP141(
        settings.mnemonic,
        false,
        ref.shortName,
        "m/0'/0'",
        "p2wpkhInP2sh"
      );
    } catch (e) {}
    try {
      bip141seed = Gen.withSeedBIP141(
        settings.bip32Seed,
        ref.shortName,
        "m/0'/0'",
        "p2wpkhInP2sh"
      );
    } catch (e) {}
    try {
      withExtPub44 = Gen.withExtPub(ref.bip44AccountExtPubKey, ref.shortName);
    } catch (e) {}
    try {
      withExtPub44Internal = Gen.withExtPub(
        ref.bip44AccountExtPubKey,
        ref.shortName,
        44,
        0,
        1
      );
    } catch (e) {}
    try {
      withExtPub49 = Gen.withExtPub(
        ref.bip49AccountExtPubKey,
        ref.shortName,
        49
      );
    } catch (e) {}
    try {
      withExtPub84 = Gen.withExtPub(
        ref.bip84AccountExtPubKey,
        ref.shortName,
        84
      );
    } catch (e) {}

    // Test root Keys
    if (ref.bip32RootKeyBip44 != undefined) {
      it("Expect bip32RootKeyBip44 to match reference.", function () {
        assert.strictEqual(bip44.bip32RootKey, ref.bip32RootKeyBip44);
      });
    }
    if (ref.bip32RootKeyBip49 != undefined) {
      it("Expect bip32RootKeyBip49 to match reference.", function () {
        assert.strictEqual(bip49.bip32RootKey, ref.bip32RootKeyBip49);
      });
    }
    if (ref.bip32RootKeyBip84 != undefined) {
      it("Expect bip32RootKeyBip84 to match reference.", function () {
        assert.strictEqual(bip84.bip32RootKey, ref.bip32RootKeyBip84);
      });
    }
    if (ref.bip32RootKeyBip84 != undefined) {
      it("Expect bip32RootKeyBip84 to match reference.", function () {
        assert.strictEqual(bip84.bip32RootKey, ref.bip32RootKeyBip84);
      });
    }
    if (ref.bip32RootKeyBip44WithPassphrase != undefined) {
      it("Expect bip32RootKeyBip44 to match reference when passphrase used.", function () {
        assert.strictEqual(
          bip44WithPassPhrase.bip32RootKey,
          ref.bip32RootKeyBip44WithPassphrase
        );
      });
    }
    if (ref.bip32RootKeyBip49 != undefined) {
      it("Expect bip32RootKeyBip141 to match reference.", function () {
        assert.strictEqual(bip141.bip32RootKey, ref.bip32RootKeyBip49);
      });
    }

    // Test extended pub key as this generally requires all previous keys to be accurate.
    if (ref.bip32ExtPubKeyBip44 != undefined) {
      it("Expect bip32ExtPubKeyBip44 to match reference.", function () {
        assert.strictEqual(bip44.bip32XpubKey, ref.bip32ExtPubKeyBip44);
      });
    }
    if (ref.bip32ExtPubKeyBip49 != undefined) {
      it("Expect bip32ExtPubKeyBip49 to match reference.", function () {
        assert.strictEqual(bip49.bip32XpubKey, ref.bip32ExtPubKeyBip49);
      });
    }
    if (ref.bip32ExtPubKeyBip84 != undefined) {
      it("Expect bip32ExtPubKeyBip84 to match reference.", function () {
        assert.strictEqual(bip84.bip32XpubKey, ref.bip32ExtPubKeyBip84);
      });
    }

    // Test address generation.
    if (
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined
    ) {
      it("Expect addressBip44index0 and addressBip44index1 address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip44.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip44index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip44index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip44index0);
        assert.strictEqual(addresses[1].address, ref.addressBip44index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip44index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip44index1);
      });
    }

    if (
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined &&
      bip44seed != false
    ) {
      it("Expect addressBip44index0 and addressBip44index1 address when generated with seed, pub, and priv keys to match reference.", async function () {
        const addresses = await bip44seed.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip44index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip44index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip44index0);
        assert.strictEqual(addresses[1].address, ref.addressBip44index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip44index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip44index1);
      });
    }

    if (ref.addressBip44HardIndex0 != undefined) {
      it("Expect addressBip44HardIndex0 hardened address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip44Hardened.generate(1);

        assert.strictEqual(addresses[0].address, ref.addressBip44HardIndex0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip44HardIndex0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip44HardIndex0);
      });
    }

    if (ref.addressBip44EncryptedIndex0 != undefined) {
      it("Expect bip44Encrypted encrypted address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip44Encrypted.generate(1);

        assert.strictEqual(
          addresses[0].address,
          ref.addressBip44EncryptedIndex0
        );
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip44EncryptedIndex0);
        assert.strictEqual(
          addresses[0].privKey,
          ref.privKeyBip44EncryptedIndex0
        );
      }).timeout(10000);
    }

    if (
      ref.addressBip49index0 != undefined &&
      ref.addressBip49index1 != undefined
    ) {
      it("Expect addressBip49index0 and addressBip49index1 address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip49.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip49index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip49index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip49index0);
        assert.strictEqual(addresses[1].address, ref.addressBip49index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip49index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip49index1);
      });
    }

    if (ref.addressBip49EncryptedIndex0 != undefined) {
      it("Expect bip49Encrypted encrypted address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip49Encrypted.generate(1);

        assert.strictEqual(
          addresses[0].address,
          ref.addressBip49EncryptedIndex0
        );
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip49EncryptedIndex0);
        assert.strictEqual(
          addresses[0].privKey,
          ref.privKeyBip49EncryptedIndex0
        );
      }).timeout(10000);
    }

    if (
      ref.addressBip84index0 != undefined &&
      ref.addressBip84index1 != undefined
    ) {
      it("Expect addressBip84index0 and addressBip84index1 address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip84.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip84index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip84index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip84index0);
        assert.strictEqual(addresses[1].address, ref.addressBip84index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip84index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip84index1);
      });
    }

    if (
      ref.addressBip32index0 != undefined &&
      ref.addressBip32index1 != undefined
    ) {
      it("Expect addressBip32index0 and addressBip32index1 address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip32.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip32index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip32index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip32index0);
        assert.strictEqual(addresses[1].address, ref.addressBip32index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip32index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip32index1);
      });
    }

    if (
      ref.addressBip32index0 != undefined &&
      ref.addressBip32index1 != undefined &&
      bip32seed != false
    ) {
      it("Expect addressBip32index0 and addressBip32index1 address with seed instead of mnemonic, pub, and priv keys to match reference.", async function () {
        const addresses = await bip32seed.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip32index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip32index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip32index0);
        assert.strictEqual(addresses[1].address, ref.addressBip32index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip32index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip32index1);
      });
    }

    if (
      ref.addressBip141index0 != undefined &&
      ref.addressBip141index1 != undefined
    ) {
      it("Expect addressBip32index0 and addressBip32index1 address, pub, and priv keys to match reference.", async function () {
        const addresses = await bip141.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip141index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip141index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip141index0);
        assert.strictEqual(addresses[1].address, ref.addressBip141index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip141index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip141index1);
      });
    }

    if (
      ref.addressBip141index0 != undefined &&
      ref.addressBip141index1 != undefined &&
      bip141seed != false
    ) {
      it("Expect addressBip32index0 and addressBip32index1 address with seed instead of mnemonic, pub, and priv keys to match reference.", async function () {
        const addresses = await bip141seed.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip141index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip141index0);
        assert.strictEqual(addresses[0].privKey, ref.privKeyBip141index0);
        assert.strictEqual(addresses[1].address, ref.addressBip141index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip141index1);
        assert.strictEqual(addresses[1].privKey, ref.privKeyBip141index1);
      });
    }

    if (
      ref.bip44AccountExtPubKey !== undefined &&
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined
    ) {
      it("Expect extPub generated address addressBip44index0 and addressBip44index1 address and pub keys to match reference.", async function () {
        const addresses = await withExtPub44.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip44index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip44index0);
        assert.strictEqual(addresses[0].privKey, "");
        assert.strictEqual(addresses[1].address, ref.addressBip44index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip44index1);
        assert.strictEqual(addresses[1].privKey, "");
      });
    }

    if (
      ref.bip44AccountExtPubKey !== undefined &&
      ref.addressBip44index0 != undefined &&
      ref.addressBip44index1 != undefined &&
      ref.shortName == "BTC"
    ) {
      it("Expect extPub generated address using internal option ( i.e. m/44'/0'/0'/1/0 ) with addressBip44index0 and addressBip44index1 address and pub keys to match reference.", async function () {
        const addresses = await withExtPub44Internal.generate(2);

        assert.strictEqual(
          addresses[0].address,
          ref.addressBip44index0Internal
        );
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip44index0Internal);
        assert.strictEqual(addresses[0].privKey, "");
        assert.strictEqual(
          addresses[1].address,
          ref.addressBip44index1Internal
        );
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip44index1Internal);
        assert.strictEqual(addresses[1].privKey, "");
      });
    }

    if (
      ref.bip49AccountExtPubKey !== undefined &&
      ref.addressBip49index0 != undefined &&
      ref.addressBip49index1 != undefined
    ) {
      it("Expect extPub generated address addressBip49index0 and addressBip49index1 address and pub keys to match reference.", async function () {
        const addresses = await withExtPub49.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip49index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip49index0);
        assert.strictEqual(addresses[0].privKey, "");
        assert.strictEqual(addresses[1].address, ref.addressBip49index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip49index1);
        assert.strictEqual(addresses[1].privKey, "");
      });
    }

    if (
      ref.bip84AccountExtPubKey !== undefined &&
      ref.addressBip84index0 != undefined &&
      ref.addressBip84index1 != undefined
    ) {
      it("Expect extPub generated address addressBip84index0 and addressBip84index1 address and pub keys to match reference.", async function () {
        const addresses = await withExtPub84.generate(2);

        assert.strictEqual(addresses[0].address, ref.addressBip84index0);
        assert.strictEqual(addresses[0].pubKey, ref.pubKeyBip84index0);
        assert.strictEqual(addresses[0].privKey, "");
        assert.strictEqual(addresses[1].address, ref.addressBip84index1);
        assert.strictEqual(addresses[1].pubKey, ref.pubKeyBip84index1);
        assert.strictEqual(addresses[1].privKey, "");
      });
    }
  });
}
