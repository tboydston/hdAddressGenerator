const bip39 = require("bip39");

const Gen = require("../hdAddressGenerator");
const reference = require("./fixtures/referenceVectors.json");

/**
 * Checks the first address of every coin against the vectors used by the reference tool's own test suite.
 * See tests/fixtures/referenceVectors.json for the source.
 */

// The reference phrase is shorter than a standard BIP 39 mnemonic, so its seed is used directly.
const seed = bip39.mnemonicToSeedSync(reference.phrase).toString("hex");

// Coins where this library is known to differ from the reference tool.
const knownDifferences = {
  XWC: "Whitecoin's own address and key format is not implemented.",
  GRS: "Groestlcoin is not supported.",
  GRSt: "Groestlcoin is not supported.",
  ELA: "Elastos is not supported.",
  NAS: "Nebulas is not supported.",
};

const firstAddress = async (vector) => {
  const [generated] = await Gen.withSeed(seed, vector.coin).generate(1);
  let { address } = generated;

  // The reference tool shows these coins in their own address format by default.
  if (vector.address.startsWith("bitcoincash:")) {
    address = Gen.convertAddress(address, "cashAddress");
  }
  if (vector.address.startsWith("simpleledger:")) {
    address = Gen.convertAddress(address, "bchSlp");
  }

  return { ...generated, address };
};

const expectMatch = async (vector) => {
  const generated = await firstAddress(vector);

  expect(generated.address).toBe(vector.address);
  expect(generated.pubKey).toBe(vector.pubKey ?? generated.pubKey);
  expect(generated.privKey).toBe(vector.privKey ?? generated.privKey);
};

const matching = reference.vectors.filter(
  (vector) => knownDifferences[vector.coin] === undefined
);
const differing = reference.vectors.filter(
  (vector) => knownDifferences[vector.coin] !== undefined
);

describe("Reference tool vectors", () => {
  it.each(matching)(
    "Expect $coin ( $network ) address and keys to match the reference tool.",
    async (vector) => {
      await expectMatch(vector);
    }
  );
});

// These pass while the difference exists and fail once it is fixed, as a prompt to move the coin above.
describe("Known differences from the reference tool", () => {
  it.failing.each(differing)(
    "$coin ( $network ) does not match the reference tool.",
    async (vector) => {
      await expectMatch(vector);
    }
  );
});
