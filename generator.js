const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const ethUtil = require('ethereumjs-util')
const bchaddr = require('bchaddrjs')
const stellarBase = require('stellar-base')
const edHd = require('ed25519-hd-key')
const basex = require('base-x')
const nebulas = require('nebulas')
const nanoUtil = require('nanocurrency-web')
const bchSlpUtil = require('bchaddrjs-slp')
const createHash = require('create-hash')
const bs58 = require('bs58')
const groestlUtil = require('groestlcoinjs-lib')



const coinList = require('./coinlist')

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

        
        if ( coinList[coin] == undefined ){
            throw new Error(`Coin ${coin} does not exist.`)
        } else {
            this.coin = coinList[coin]
            this.coinName = this.coin.shortName
            this.coinNumber = this.coin.coinNumber
        }

        if ( this.coin.network == undefined ){
            throw new Error(`Coin ${coin} exists but has no network details.`)
        }

        if ( seed !== false ){
            this.seed = seed
        } else if (mnemonic != false && passphrase == false ) {
            this.seed = bip39.mnemonicToSeedSync(mnemonic)
        } else {
            this.seed = bip39.mnemonicToSeedSync(mnemonic,passPhrase)
        }
        
        this.root = bip32.fromSeed(this.seed)

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
         
        console.log( `BIP 32 Algo: ${this.hashAlgo}` )
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
        } else {
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

            let keyPair = {}

            if ( this.coin.addressStyle == undefined ) keyPair = this.generateBitcoinLikeAddress(index)
            if ( this.coin.addressStyle == "ethereum" ) keyPair = this.generateEthereumLikeAddress(index)
            if ( this.coin.addressStyle == "tron" ) keyPair = this.generateTronLikeAddress(index)
            if ( this.coin.addressStyle == "RSK" ) keyPair = this.generateRSKLikeAddress(index)
            if ( this.coin.addressStyle == "stellar" ) keyPair = this.generateStellarLikeAddress(index)
            if ( this.coin.addressStyle == "nebulas" ) keyPair = this.generateNebulasLikeAddress(index)
            if ( this.coin.addressStyle == "ripple" ) keyPair = this.generateRippleLikeAddress(index)
            if ( this.coin.addressStyle == "nano" ) keyPair = this.generateNanoLikeAddress(index)
            if ( this.coin.addressStyle == "jingtum" ) keyPair = this.generateJingtumLikeAddress(index)
            if ( this.coin.addressStyle == "casinoCoin" ) keyPair = this.generateCasinoCoinLikeAddress(index)
            if ( this.coin.addressStyle == "crown" ) keyPair = this.generateCrownLikeAddress(index)
            if ( this.coin.addressStyle == "eosio" ) keyPair = this.generateEOSLikeAddress(index)
            if ( this.coin.addressStyle == "fio" ) keyPair = this.generateFIOLikeAddress(index)
            if ( this.coin.addressStyle == "groestlcoin" ) keyPair = this.generateGroestlcoinLikeAddress(index)

            console.log(
                keyPair.path,
                //this.convertAddress(keyPair.address,"bchSlp"),
                keyPair.address,
                keyPair.pubKey,
                keyPair.privKey,
            )
            addresses.push(keyPair)
            
            index++

        }

        return addresses

    }

    convertAddress(address,format){

        if( format == "cashAddress" ) return bchaddr.toCashAddress(address)
        if( format == "bitpayAddress" ) return bchaddr.toBitpayAddress(address)
        if( format == "bchSlp") return bchSlpUtil.toSlpAddress(address)

        throw new Error(`Address format ${format} does not exist.`)

    }

    generateBitcoinLikeAddress(index){

        let keyPair = {}
        keyPair.path = this.path(index)
        keyPair.rawPair = this.root.derivePath(keyPair.path)
        
        if( this.bip == 49 ){
            keyPair.rawPair.network = this.coin.network
            keyPair.rawAddress = bitcoin.payments.p2sh({ redeem: bitcoin.payments.p2wpkh({
                pubkey: keyPair.rawPair.publicKey,
                network: this.coin.network,
            }), 
            network: this.coin.network 
            })
        } else {
            keyPair.rawPair.network = this.coin.network[this.hashAlgo]
            keyPair.rawAddress = bitcoin.payments[this.hashAlgo]({ 
                pubkey: keyPair.rawPair.publicKey, 
                network: this.coin.network
            })
        }

        keyPair.address = keyPair.rawAddress.address
        keyPair.privKey = keyPair.rawPair.toWIF()
        keyPair.pubKey = keyPair.rawPair.publicKey.toString('hex')

        return keyPair

    }

    generateEthereumLikeAddress(index){

        let addressPrefix = this.coin.addressPrefix

        let keyPair = {}
        keyPair.path = this.path(index)
        keyPair.rawPair = this.root.derivePath(keyPair.path)
       
        let ethPubkey = ethUtil.importPublic(keyPair.rawPair.publicKey)
        let addressBuffer = ethUtil.publicToAddress(ethPubkey)
        let hexAddress = addressBuffer.toString('hex')
        let checksumAddress = ethUtil.toChecksumAddress(addressPrefix+hexAddress)
        
        keyPair.address = ethUtil.addHexPrefix(checksumAddress)
        keyPair.privKey = addressPrefix+keyPair.rawPair.privateKey.toString('hex')
        keyPair.pubKey = addressPrefix+keyPair.rawPair.publicKey.toString('hex')

        return keyPair

    }

    generateTronLikeAddress(index){

        let addressPrefix = this.coin.addressPrefix
       
        let keyPair = {}
        keyPair.path = this.path(index)
        keyPair.rawPair = this.root.derivePath(keyPair.path)

        keyPair.ECPair =  bitcoin.ECPair.fromPrivateKey(keyPair.rawPair.privateKey, { network: this.coin.network.p2pkh, compressed: false })
      

        let ethPubkey = ethUtil.importPublic(keyPair.ECPair.publicKey)
        let addressBuffer = ethUtil.publicToAddress(ethPubkey)

        keyPair.address = bitcoin.address.toBase58Check(addressBuffer, addressPrefix )
        keyPair.privKey = keyPair.ECPair.privateKey.toString('hex')
        keyPair.pubKey = keyPair.rawPair.publicKey.toString('hex')

        return keyPair

    }

    generateRSKLikeAddress(index){


        let addressPrefix = this.coin.addressPrefix
        let chainId = ( this.coin.chainId != undefined )? this.coin.chainId : null 
         
        let keyPair = {}
        keyPair.path = this.path(index)
        keyPair.rawPair = this.root.derivePath(keyPair.path)
       
        let ethPubkey = ethUtil.importPublic(keyPair.rawPair.publicKey)
        let addressBuffer = ethUtil.publicToAddress(ethPubkey)
        let hexAddress = addressBuffer.toString('hex')
        let checksumAddress = ethUtil.toChecksumAddress(addressPrefix+hexAddress,chainId)
        
        keyPair.address = ethUtil.addHexPrefix(checksumAddress)
        keyPair.privKey = addressPrefix+keyPair.rawPair.privateKey.toString('hex')
        keyPair.pubKey = addressPrefix+keyPair.rawPair.publicKey.toString('hex')

        return keyPair

    }

    generateStellarLikeAddress(index){        
        
        let keyPair = {}
        keyPair.path = "m/"+this.bip+"'/"+this.coin.coinNumber + "'/" + index + "'"

        let Ed25519Seed = edHd.derivePath(keyPair.path, this.seed)
        keyPair.rawPair = stellarBase.Keypair.fromRawEd25519Seed(Ed25519Seed.key)

        keyPair.address = keyPair.rawPair.publicKey()
        keyPair.privKey = keyPair.rawPair.secret()
        keyPair.pubKey = keyPair.rawPair.publicKey()

        return keyPair

    }

    generateNebulasLikeAddress(index){

        let keyPair = {}
        keyPair.path = this.path(index)
        keyPair.rawPair = this.root.derivePath(keyPair.path)

        let privKeyBuffer = keyPair.rawPair.privateKey
        let nebulasAccount = nebulas.Account.NewAccount()

        nebulasAccount.setPrivateKey(privKeyBuffer)
        keyPair.address = nebulasAccount.getAddressString()
        keyPair.privKey = nebulasAccount.getPrivateKeyString()
        keyPair.pubKey = nebulasAccount.getPublicKeyString()

        return keyPair

    }

    generateRippleLikeAddress(index){
        
        let keyPair = this.generateBitcoinLikeAddress(index)  
        
        keyPair.address = basex('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz').encode(
            basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(keyPair.address))
        keyPair.privKey = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(keyPair.privKey).toString("hex").slice(2,66)

        return keyPair

    }

    generateNanoLikeAddress(index){

        let keyPair = {}
        keyPair.path = this.path(index)

        keyPair.rawPair = nanoUtil.wallet.accounts(this.seed.toString('hex'), index, index)
        
        keyPair.address = keyPair.rawPair[0].address
        keyPair.privKey = keyPair.rawPair[0].privateKey
        keyPair.pubKey = keyPair.rawPair[0].publicKey

        return keyPair

    }

    generateJingtumLikeAddress(index){
        
        let keyPair = this.generateBitcoinLikeAddress(index)  
        
        keyPair.address = basex('jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz').encode(
            basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(keyPair.address))
        keyPair.privKey = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(keyPair.privKey).toString("hex").slice(2,66)

        return keyPair

    }

    generateCasinoCoinLikeAddress(index){
        
        let keyPair = this.generateBitcoinLikeAddress(index)  
        
        keyPair.address = basex('cpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2brdeCg65jkm8oFqi1tuvAxyz').encode(
            basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(keyPair.address))
        keyPair.privKey = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').decode(keyPair.privKey).toString("hex").slice(2,66)

        return keyPair

    }

    generateCrownLikeAddress(index){
        
        let keyPair = this.generateBitcoinLikeAddress(index)  
        keyPair.address = this.crownAddressConvert(keyPair.address)
        
        return keyPair
    }

    generateEOSLikeAddress(index){

        let keyPair = this.generateBitcoinLikeAddress(index) 
        keyPair.address = ""
        keyPair.privKey = this.EOSbufferToPrivate(keyPair.rawPair.privateKey)
        keyPair.pubKey = this.EOSbufferToPublic(keyPair.rawPair.publicKey,"EOS")

        return keyPair

    }

    generateFIOLikeAddress(index){

        let keyPair = this.generateBitcoinLikeAddress(index) 
        keyPair.address = ""
        keyPair.privKey = this.EOSbufferToPrivate(keyPair.rawPair.privateKey)
        keyPair.pubKey = this.EOSbufferToPublic(keyPair.rawPair.publicKey,"FIO")

        return keyPair

    }

    generateGroestlcoinLikeAddress(index){

        let keyPair = this.generateBitcoinLikeAddress(index) 
        
        if ( this.hashAlgo == "p2wpkh" || this.hashAlgo == "p2wpkhInP2sh" ){
            keyPair.address = groestlUtil.address.fromOutputScript(keyPair.rawPair.publicKey,this.coin.network)
        }

        return keyPair

    }

    crownAddressConvert(oldAddress){

        let ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
        let b58 =  basex(ALPHABET);

        let addrBytes = b58.decode(oldAddress);

        let hash160 = Buffer.from(new Uint16Array(23));
        hash160[0]= 0x01; //C
        hash160[1]= 0x75; //R
        hash160[2]= 0x07; //W
        addrBytes.copy(hash160, 3, 1, 21);

        let checksum = bitcoin.crypto.hash256(hash160).subarray(0, 4);
        let binaryAddr = Buffer.from(new Uint16Array(27));
        
        binaryAddr.set(hash160,0);
        checksum.copy(binaryAddr, 23, 0, 4);

        let newAddress = b58.encode(binaryAddr);
        return newAddress;
  
    }

    EOSbufferToPublic(pubBuf,prefix) {

        const EOS_PUBLIC_PREFIX = prefix;
        let checksum = createHash("rmd160").update(pubBuf).digest("hex").slice(0, 8);
        pubBuf = Buffer.concat([pubBuf, Buffer.from(checksum, "hex")]);
        return EOS_PUBLIC_PREFIX.concat(bs58.encode(pubBuf));
    }
      
    EOSbufferToPrivate(privBuf) {

        const EOS_PRIVATE_PREFIX = "80";
        privBuf = Buffer.concat([Buffer.from(EOS_PRIVATE_PREFIX, "hex"), privBuf]);
        let tmp = createHash("sha256").update(privBuf).digest();
        let checksum = createHash("sha256").update(tmp).digest("hex").slice(0, 8);
        privBuf = Buffer.concat([privBuf, Buffer.from(checksum, "hex")]);
        return bs58.encode(privBuf);
        
    }

    path(index){
        return `m/${this.bip}'/${this.coin.coinNumber}'/${this.account}'/${this.change}/${index}${this.hardened?"'":""}`
    }
    
}

module.exports = AddressGenerator 
