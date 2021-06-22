# HD Address Generator

Generate hierarchical deterministic(HD) coin specific crypto addresses from single master key pair for over 190 different cryptocurrencies.

# Features 

- Mnemonic generation 
- BIP 32,44,49,84,141 address logic. 
- p2pkh(legacy), p2wpkhInP2sh(segwit compatible), p2wpkh(bech32) hashing.
- Unique address building logic for ETH,EOS,XRP,XLM, and others. 
- Custom BIP 39 Passphrases.
- BIP 38 private key encryption.
- Neutered address generation from extended public keys. 

# Installation  

`
npm install hdaddressgenerator
`

# Usage


## Quick Start
```
const HdAddGen = require('hdaddressgenerator')
const mnemonic = "brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero"
// OR you can use the HdAddGen.getMnemonic() function to generate a mnemonic and seed. 


// The easiest way to initiate a class is by using an initiation function.  
let bip44 = HdAddGen.withMnemonic(mnemonic,false,"BTC")

// Generates 10 addresses from index 0
let addresses = bip44.generate(10)

addresses.forEach(address => {
    console.log(
        address.path,
        address.address,
        address.pubKey,
        address.privKey,
    )
});

```

## Examples

See the examples.js file. 

## Initiation Functions


### Options Overview

Note: Not all initiation functions require all options.

- mnemonic: BIP39 mnemonic with spaces between words.
- seed: BIP39 seed used instead of a mnemonic.
- xpub: Account extended public key used to generate addresses without private keys.
- passphrase: Additional BIP39 passphrase custom passphrase to further secure mnemonic.
- coin: Coin short name ( BTC, ETH, XRP, ect.).
- hardened: Should the resulting addresses be hardened?
- bip: What BIP style addresses are you trying to create. Default: 44 Options: 32,44,49,84,141
- account: Account used in HD address path. 
- change: Used in HD address path to signify if address is for change.
- bip38Password: Additional password used to encrypt private keys.
- customPath: Custom path overwriting the path generated using bip/account/change.
- hashAlgo: Algorithm used to hash the address. Coin must have supporting network information. Options: p2pkh,p2wpkhInP2sh,p2wpkh 


### Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using mnemonic and optional pass phrase.

`
HdAddGen.withMnemonic(mnemonic,passphrase,coin,hardened=false,bip=44,account=0,change=0,bip38Password=false)
`

### Generate BIP 44(legacy),49(segwit compatible), or 84(bech32) address using seed.

`
HdAddGen.withSeed(seed,coin,hardened=false,bip=44,account=0,change=0,bip38Password=false)
`

### Generate BIP 32 legacy addresses with custom path, mnemonic, and optional pass phrase. 

`
HdAddGen.withMnemonicBIP32(mnemonic,passphrase,coin,customPath,hardened=false,bip38Password=false)
`

### Generate BIP 32 legacy addresses with custom path and seed. 

`
HdAddGen.withSeedBIP32(seed,coin,customPath,hardened=false,bip38Password=false)
`

### Generate BIP 141 addresses with custom path, mnemonic, and hashing algo. 

`
HdAddGen.withMnemonicBIP141(mnemonic,passphrase,coin,customPath,hashAlgo,hardened=false,bip38Password=false)
`

### Generate BIP 141 addresses with custom path, seed, and hashing algo. 

`
HdAddGen.withSeedBIP141(seed,coin,customPath,hashAlgo,hardened=false,bip38Password=false)
`

### Generate addresses without private keys from Account Extended Public Keys. 

Addresses generated with only an extended public key ( extPub ) go not have private keys. 

`
HdAddGen.withExtPub(extPub,coin,bip=44,account=0,change=0)
`


## Generating Addresses 

### Options

- totalToGenerate: Number of addresses you would like to generate starting from the index.
- startIndex: Index to start generating addresses from.

`
hdAddGen.generate(totalToGenerate,startIndex=0)
`

## Address Conversion 

For certain coins ( currently only BCH ). You may need to convert legacy addresses into different formats. 

### Options

- address: Coin specific address.
- format: Address format you would like to convert the address to (cashAddress,bitpayAddress,bchSlp). 

`
convertAddress(address,format)
`

# Tests

Before using this library in production it is important that you verify your coin has a test in the tests/coins folder to insure that addresses are generated accurately. 

If it does not, it is easy to create one. 
1. Go to [iancoleman.io/bip39/](https://iancoleman.io/bip39/) or a similar site. 
2. Enter the seed from the tests/settings.js file into the as the mnemonic. 
3. Create a new coin in the tests/coins/ folder using the shortname of your coin. This needs to match the short name used in the coinlist [here](https://github.com/tboydston/coinnetworklist/blob/main/coinNetworkList.js). 
4. Copy the content of a coin that is similar to yours from the tests/coins/ folder and replace the values you generated. You probably don't want to use bitcoin as this contains some general tests that are not coin specific. If your coin uses bip 49 or 84 address make sure you include those tests as well. 
5. Replace your coin shortname with the contents of 'testCoin' in the test/settings.js file. 
6. Test your coin with `mocha tests/coinTests.js`. If all tests pass change 'testCoin' back to 'ALL' im the settings file commit and submit a pull request. If your test fail double check your content. If it still fails open an issue for your coin. 

# Credit 

This generator is based on Ian Coleman's BIP 39 generator available at [iancoleman.io/bip39/](https://iancoleman.io/bip39/) which is in turn based on the work of many people who created the underlining libraries. 
