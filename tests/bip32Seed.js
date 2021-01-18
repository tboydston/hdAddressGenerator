const assert = require('assert');
const settings = require("./settings")

const Gen = require("../generator.js")
const gen = Gen.withMnemonic(settings.mnemonic,false,"BTC")

describe('bip39seed', () => {
    it('Expect bip32Seed to match reference in settings.', () => {
      assert.strictEqual(gen.bip32Seed,settings.bip32Seed)
    })
})