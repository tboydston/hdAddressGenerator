const coinList = require('./coinList')
const Generator = require('./generator')

let gen = Generator.withMnemonic("brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero",false,"GRS",false,44)
//let gen = Generator.withMnemonicBIP32("brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero",false,"m/44'/0'/0'",false)
//let gen = Generator.withMnemonicBIP141("brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero",false,"m/0'/0","p2wpkh")
gen.generate(10,0)