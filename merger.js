const fs = require('fs')
const { connect } = require('http2')
let coins = require('./coinList')


let dataObject = {}

for (const [coin, data] of Object.entries(coins)) {

    dataObject[coin] = coins[coin]
    
    if( coins[coin].network == undefined ) continue 
    
    dataObject[coin].network.P2PKH = {}
    
    if( coins[coin].network.messagePrefix != undefined ) dataObject[coin].network.P2PKH.messagePrefix = dataObject[coin].network.messagePrefix
    if( coins[coin].network.bip32 != undefined ) dataObject[coin].network.P2PKH.bip32 = dataObject[coin].network.bip32
    if( coins[coin].network.pubKeyHash != undefined ) dataObject[coin].network.P2PKH.pubKeyHash = dataObject[coin].network.pubKeyHash
    if( coins[coin].network.scriptHash != undefined ) dataObject[coin].network.P2PKH.scriptHash = dataObject[coin].network.scriptHash
    if( coins[coin].network.wif != undefined ) dataObject[coin].network.P2PKH.wif = dataObject[coin].network.wif
    if( coins[coin].network.bech32 != undefined ) dataObject[coin].network.P2PKH.bech32 = dataObject[coin].network.bech32
    
    delete dataObject[coin].network.messagePrefix
    delete dataObject[coin].network.bip32
    delete dataObject[coin].network.pubKeyHash
    delete dataObject[coin].network.scriptHash
    delete dataObject[coin].network.wif
    delete dataObject[coin].network.bech32
    

}

console.log(dataObject)

//fs.writeFileSync('./coinlist2.js', JSON.stringify(dataObject) , 'utf-8'); 


