const HdAddGen = require("./hdAddressGenerator");

const mnemonic =
  "brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero";
const seed =
  "09a0a3b58d10bbc456254f1915c2627d8f0e9968922505b39dbb08f6a5dc9dafdee40cff16aa488add7ee4e2ec6eaf40425d3f2aea81c18c2c314d58885e923a";
const xpub =
  "xpub6CfhGffKu2dhKxhxVS7gmTwtfK6NKA6pVAjgTgManuJoTVqLjiN6RTydgE13GPGCShaEQk1BjbHZ7Lps7eE5ECTk48vJuYjcf2FsPN1n9av";

(async () => {
  /**
   * Generate cryptographically random Mnemonic and seed buffer.
   * This is a pass through for the Bip39 libraries generateMnemomic function.
   * Please review the bip39 implementation to make sure you are comfortable with
   * the implementation before using this for anything critical.
   */
  const sampleMnemonic = await HdAddGen.generateMnemonic(
    "english",
    128 /* 128=12words, 256=24words */
  );

  console.log(`\nSample Mnemonic and Seed Generation`);
  console.log(`Mnemonic: ${sampleMnemonic.mnemonic}`);
  console.log(`Seed: ${sampleMnemonic.seed.toString("hex")}`);

  /**
   * Generate BIP 44 ( Legacy '1' ) addresses for bitcoin.
   */
  const bip44 = HdAddGen.withMnemonic(mnemonic, false, "BTC");

  console.log(`\nBIP 44 ( Legacy '1' ) Key Generation`);

  /**
   * HD information and keys are available directly from the object.
   */
  console.log(`BIP 44 ( Legacy '1' ) Key Generation`);
  console.log(`BIP 32 Algo: ${bip44.hashAlgo}`);
  console.log(`BIP 32 Path: ${bip44.bip32Path}`);
  console.log(`BIP 32 Seed: ${bip44.bip32Seed}`);
  console.log(`BIP 32 Root Key: ${bip44.bip32RootKey}`);
  console.log(`Account X Priv Key: ${bip44.accountXprivKey}`);
  console.log(`Account X Pub Key: ${bip44.accountXpubKey}`);
  console.log(`BIP 32 X Priv Key: ${bip44.bip32XprivKey}`);
  console.log(`BIP 32 X Pub Key: ${bip44.bip32XpubKey}\n`);

  // Generate 3 address pairs starting from index 0,
  const bip44Addresses = await bip44.generate(3, 0);

  bip44Addresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate BIP 44 ( Legacy '1' ) addresses for bitcoin with seed instead of mnemonic.
   */
  const bip44withSeed = HdAddGen.withSeed(seed, "BTC");

  console.log(`\nBIP 44 ( Legacy '1' ) Key Generation with seed`);

  // Generate 3 address pairs starting from index 0,
  const bip44withSeedAddresses = await bip44withSeed.generate(3, 0);

  bip44withSeedAddresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate BIP 44 ( Legacy '1' ) encrypted addresses.
   */
  const bip44withEnc = HdAddGen.withSeed(
    seed,
    "BTC",
    false,
    44,
    0,
    0,
    "password"
  );
  bip44withEnc.showEncryptProgress = true; // You can enable encryption progress to have the status logged to console.

  console.log(
    `\nBIP 44 ( Legacy '1' ) encrypted addresses. This can be quite slow...`
  );

  // Generate 3 address pairs starting from index 0,
  const bip44withEncAddresses = await bip44withEnc.generate(2, 0);

  bip44withEncAddresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate BIP 49 ( Segwit Compatible '3' ) addresses for bitcoin with mnemonic passphrase.
   */
  const bip49 = HdAddGen.withMnemonic(mnemonic, "test", "BTC", false, 49);

  console.log(`\nBIP 49 ( Segwit Compatible '3' ) Key Generation`);

  // Generate 3 address pairs starting from index 0,
  const bip49Addresses = await bip49.generate(3, 0);

  bip49Addresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate hardened BIP 84 ( Segwit bech32 'bc1' ) addresses for bitcoin.
   */
  const bip84 = HdAddGen.withMnemonic(mnemonic, false, "BTC", true, 49);

  console.log(`\nBIP 84 ( Segwit bech32 'bc1' ) hardened Key Generation`);

  // Generate 3 address pairs starting from index 0,
  const bip84Addresses = await bip84.generate(3, 0);

  bip84Addresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate BIP 32 addresses with custom path.
   */
  const bip32 = HdAddGen.withMnemonicBIP32(
    mnemonic,
    false,
    "BTC",
    "m/44'/0'/0'",
    false
  );

  console.log(`\nBIP 32 Key Generation`);

  // Generate 3 address pairs starting from index 0,
  const bip32Addresses = await bip32.generate(3, 0);

  bip32Addresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate BIP 144 addresses with custom path and algo.
   */
  const bip141 = HdAddGen.withMnemonicBIP141(
    mnemonic,
    false,
    "BTC",
    "m/44'/0'/0'",
    "p2wpkh"
  );

  console.log(`\nBIP 141 Key Generation`);

  // Generate 3 address pairs starting from index 0,
  const bip141Addresses = await bip141.generate(3, 0, "m/0'/0", "p2wpkh");

  bip141Addresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * Generate Neutered BIP 44 ( Legacy '1' ) addresses for bitcoin with XPUB.
   */

  let bip44xpub = {};

  bip44xpub = HdAddGen.withExtPub(xpub, "BTC", 44);

  // Generate 3 address pairs starting from index 0,
  const bip44xpubAddresses = await bip44xpub.generate(3);
  bip44xpubAddresses.forEach((address) => {
    console.log(address.path, address.address, address.pubKey, address.privKey);
  });

  /**
   * BCH addresses conversion.
   */
  const bip44BCH = HdAddGen.withSeed(seed, "BCH");

  console.log(`\nBCH Address Conversion`);

  // Generate 3 address pairs starting from index 0,
  const bip44BCHAddresses = await bip44BCH.generate(3, 0);

  bip44BCHAddresses.forEach((address) => {
    console.log(
      address.path,
      bip44BCH.convertAddress(address.address, "cashAddress"),
      address.pubKey,
      address.privKey
    );
  });

  /**
   * Using promises
   */
  const bip44promise = HdAddGen.withSeed(seed, "BTC");

  // Generate 3 address pairs starting from index 0,
  // eslint-disable-next-line no-shadow
  bip44promise.generate(3, 0).then((bip44withSeedAddresses) => {
    console.log(`\nBIP 44 ( Legacy '1' ) Key Using Promises`);

    bip44withSeedAddresses.forEach((address) => {
      console.log(
        address.path,
        address.address,
        address.pubKey,
        address.privKey
      );
    });
  });
})();
