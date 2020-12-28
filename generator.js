const bip32 = require('bip32')
const bip39 = require('bip39')
const bs58 = require('bs58')
const bitcoin = require('bitcoinjs-lib')
const coinList = require('./coinList')
const { reduceEachTrailingCommentRange, isThisTypeNode } = require('typescript')


class AddressGenerator {

    coin = {}
    coinName = ""
    index = 0
    hardened = false
    bip = 0
    account = 0 
    change = 0
    bip32Seed = ""
    bip32RootKeyRaw = ""
    bip32RootKey = ""
    bip32Path = ""
    accountPath = ""
    accountXprivKey = ""
    accountXpubKey = ""
    bip32XprivKey = ""
    bip32XpubKey = ""
    hashAlgo = ""
    hashAlgos = {
        39:"",
        44:"p2pkh",
        49:"p2wpkhInP2sh",
        84:"p2wpkh",
    }



	constructor(mnemonic=false,passphrase=false,seed=false,coin,hardened=false,bip=44,account=0,change=0,customPath=false,hashAlgo=false){

        if ( seed !== false ){
            this.seed = seed
        } else if (mnemonic != false && passphrase == false ) {
            this.seed = bip39.mnemonicToSeedSync(mnemonic)
        } else {
            this.seed = bip39.mnemonicToSeedSync(mnemonic,passPhrase)
        }
        
        this.root = bip32.fromSeed(this.seed)

        if ( coinList[coin] == undefined ){
            throw new Error(`Coin ${coin} does not exist.`)
        } else {
            this.coin = coinList[coin]
            this.coinName = this.coin.shortName
            this.coinNumber = this.coin.coinNumber
        }

        this.bip = bip
        this.account = account
        this.change = change
        this.hardend = hardened
        this.bip32Seed = this.seed.toString('hex')
        this.bip32RootKey = bip32.fromSeed(this.seed).toBase58()
        this.hashAlgo = ( hashAlgo == false ) ? this.hashAlgos[bip] : hashAlgo
        this.bip32Path = ( customPath != false ) ? customPath : ""

        
        if ( [49,84,141].includes(bip) && this.coin.network[this.hashAlgo] == undefined ){
            throw new Error(`${this.coinName} does not support ${this.hashAlgo}.`)
        }

        this.initKeys()
        
        console.log( `BIP 32 Path: ${this.bip32Path}` )
        console.log( `BIP 32 Seed: ${this.bip32Seed}` )
        console.log( `BIP 32 Root Key: ${this.bip32RootKey}` )
        console.log( `Account X Priv Key: ${this.accountXprivKey}` )
        console.log( `Account X Pub Key: ${this.accountXpubKey}` )
        console.log( `BIP X Priv Key: ${this.bip32XprivKey}` )
        console.log( `BIP X Pub Key: ${this.bip32XpubKey}` )


    }

    static withSeed(seed,coin,hardened=false,bip=44,account=0,change=0){
        return new AddressGenerator(false,false,seed,coin,hardened,bip,account,change)
    }

    static withMnemonic(mnemonic,passphrase,coin,hardened=false,bip=44,account=0,change=0){
        return new AddressGenerator(mnemonic,passphrase,false,coin,hardened,bip,account,change)
    }

    static withMnemonicBIP32(mnemonic,passphrase,customPath,hardened=false){
        return new AddressGenerator(mnemonic,passphrase,false,"BTC",hardened,32,0,0,customPath)
    }

    static withSeedBIP32(seed,customPath,hardened=false){
        return new AddressGenerator(false,false,seed,coin,"BTC",hardened,32,0,0,customPath)
    }

    static withMnemonicBIP141(mnemonic,passphrase,customPath,hashAlgo,hardened=false){
        return new AddressGenerator(mnemonic,passphrase,false,"BTC",hardened,141,0,0,customPath,hashAlgo)
    }

    static withSeedBIP141(seed,customPath,hashAlgo,hardened=false){
        return new AddressGenerator(false,false,seed,coin,"BTC",hardened,141,0,0,customPath,hashAlgo)
    }

    initKeys(){

        if( this.bip == 32 ){
            this.bip32RootKeyRaw = bip32.fromSeed(this.seed)
        }

        if( this.bip == 44 ){
            this.hashAlgo = "p2pkh"
            this.bip32RootKeyRaw = bip32.fromSeed(this.seed,this.coin.network)
        }

        if( [49,84,141].includes(this.bip) ){
            this.bip32RootKeyRaw = bip32.fromSeed(this.seed,this.coin.network[this.hashAlgo])
            
        }

        this.bip32RootKey = this.bip32RootKeyRaw.toBase58()
        
        if ( this.bip != 32 && this.bip != 141 ){
            this.accountPath = `m/${this.bip}'/${this.coinNumber}'/${this.account}'`
            this.accountXprivKey = this.bip32RootKeyRaw.derivePath(this.accountPath).toBase58()
            this.accountXpubKey = this.bip32RootKeyRaw.derivePath(this.accountPath).neutered().toBase58()
            this.bip32Path = `m/${this.bip}'/${this.coinNumber}'/${this.account}'/${this.change}`
        }


        this.bip32XprivKey = this.bip32RootKeyRaw.derivePath(this.bip32Path).toBase58()
        this.bip32XpubKey = this.bip32RootKeyRaw.derivePath(this.bip32Path).neutered().toBase58()

    }

    generate(totalToGenerate,startIndex=0){

        let addresses = []
        let index = startIndex


        while ( addresses.length < totalToGenerate ) {

            let address = {}
            address.path = this.path(index)
            address.rawPair = this.root.derivePath(address.path)
      
            if( this.bip == 49 ){
                address.rawAddress = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({
                    pubkey: address.rawPair.publicKey,
                    network: this.coin.network,
                }), 
                network: this.coin.network 
                })
            } else {
                address.rawAddress = bitcoin.payments[this.hashAlgo]({ pubkey: address.rawPair.publicKey, network: this.coin.network })
            }

            address.address = address.rawAddress.address
            address.privKey = address.rawPair.toWIF()
            address.pubKey = address.rawPair.publicKey.toString('hex')

            console.log(
                address.path,
                address.address,
                address.privKey,
                address.pubKey,
            )

            addresses.push(address)
            

            index++

        }

        return addresses

    }

    path(index){
        return `m/${this.bip}'/${this.coin.coinNumber}'/${this.account}'/${this.change}/${index}${this.hardened?"'":""}`
    }
    
}

module.exports = AddressGenerator 
