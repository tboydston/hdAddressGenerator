const fs = require('fs')
const bitcoin = require('bitcoinjs-lib')
const networks = require('./networks')

mergedNetworks = {...bitcoin.networks,...networks}

const coins = require('./coins')

let dataObject = {}

coins.forEach(coin => {
    dataObject[coin.shortName] = coin
    if( mergedNetworks[coin.network] != undefined ){
        dataObject[coin.shortName].network = mergedNetworks[coin.network]
    } else { 
        console.log(coin.shortName+" has not network.")
    }
});

// fs.writeFileSync('./coinlist.js', JSON.stringify(dataObject) , 'utf-8'); 