import bitcoin from 'bitcoinjs-lib'
import { base58Validator, bech32Validator, bech32mValidator } from './validators'

import { CryptoPlugin } from './plugin'

class BTC implements CryptoPlugin {
  base58Opts = {
    bufferLength: 21,
    mainNetPrefix: [ [0x00], [0x05] ],
    testNetPrefix: [ [0x6f], [0xc4] ],
    regtestPrefix: [ [0x6f], [0xc4] ]
  }

  bech32Opts = {
    mainNetPrefix: 'bc',
    testNetPrefix: 'tb',
    regtestPrefix: 'bcrt'
  }

  public parseUrl (network: string, url: string): string | never {
    const res = /^(bitcoin:)?(\w+)/i.exec(url)
    const address = res && res[2]
    console.log('DEBUG16: [%s] *%s*', network, address)
    if (!address || !this.validate(network, address)) throw new Error('Invalid address')
    return address
  }

  public validate (network: string|null|undefined, address: string): boolean | never {
    if (!network) throw new Error('No network supplied.')
    return bech32mValidator(network, address, this.bech32Opts)
      || base58Validator(network, address, this.base58Opts)
      || bech32Validator(network, address, this.bech32Opts)
  }

  public getAddressType (url: string, network: string): string | null {
    const address = this.parseUrl(network, url)
    return bech32mValidator(network, address, this.bech32Opts) ? 'P2TR' :
      base58Validator(network, address, this.base58Opts) ? 'P2PKH/P2SH (legacy)' :
      bech32Validator(network, address, this.bech32Opts) ? 'Native SegWit' :
      null
  }
}

export default new BTC()
