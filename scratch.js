const bip32 = require('bip32')
const bip39 = require('bip39')
let bitcoin = require('bitcoinjs-lib')
const coinList = require('./coinList')



// console.log(bitcoin.networks)

const coin = "BTC"
const mnemonic =
    'brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero';
const seed = bip39.mnemonicToSeedSync(mnemonic);
const root = bip32.fromSeed(seed);
const path = "m/49'/"+coinList[coin].coinNumber+"'/0'/0/0'";
const child = root.derivePath(path);

console.log( bitcoin.networks.regtest )

console.log( coinList[coin] )
console.log( 
 
    bitcoin.payments.p2pkh({ pubkey: child.publicKey, network: coinList[coin].network })

)


function calcBip32ExtendedKey(path) {
    // Check there's a root key to derive from
    if (!bip32RootKey) {
        return bip32RootKey;
    }
    var extendedKey = bip32RootKey;
    // Derive the key from the path
    var pathBits = path.split("/");
    for (var i=0; i<pathBits.length; i++) {
        var bit = pathBits[i];
        var index = parseInt(bit);
        if (isNaN(index)) {
            continue;
        }
        var hardened = bit[bit.length-1] == "'";
        var isPriv = !(extendedKey.isNeutered());
        var invalidDerivationPath = hardened && !isPriv;
        if (invalidDerivationPath) {
            extendedKey = null;
        }
        else if (hardened) {
            extendedKey = extendedKey.deriveHardened(index);
        }
        else {
            extendedKey = extendedKey.derive(index);
        }
    }
    return extendedKey;
}





// const child = root.derivePath(path);

// const { address } = bitcoin.payments.p2sh({
//     redeem: bitcoin.payments.p2wpkh({
//     pubkey: child.publicKey,
//     network: bitcoin.networks.testnet,
//     }),
//     network: bitcoin.networks.testnet,
// });

// console.log(address)