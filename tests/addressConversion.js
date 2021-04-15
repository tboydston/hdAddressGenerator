const assert = require('assert');
const settings = require("./settings")

const Gen = require("../hdAddressGenerator.js")
const genBCH = Gen.withMnemonic(settings.mnemonic,false,"BCH")
const genSLP = Gen.withMnemonic(settings.mnemonic,false,"SLP")


const cashAddress = "bitcoincash:qpp88hghht87tvnu5gwf2qnrdcw580hf6cyl07g4z8"
const bitPayAddress = "CNXFy3oa8eUjW3AwMwmpJX4PsEcogf953Z"
const slpAddress = "simpleledger:qqrdkgy7cevz3tgj7w5nlwakhs24twkexsrxvulr5x"

describe('Address Conversion', async () => {

    const bchAddresses = await genBCH.generate(1)
    const slpAddresses = await genSLP.generate(1)

    it('Expect legacy address conversion to CashAddr to match reference', () => {
      assert.strictEqual(genBCH.convertAddress(bchAddresses[0].address,"cashAddress"),cashAddress)
    })
    it('Expect legacy address conversion to BitPay to match reference', () => {
        assert.strictEqual(genBCH.convertAddress(bchAddresses[0].address,"bitpayAddress"),bitPayAddress)
    })
    it('Expect legacy address conversion to BCH SLP to match reference', () => {
        assert.strictEqual(genBCH.convertAddress(slpAddresses[0].address,"bchSlp"),slpAddress)
    })
})