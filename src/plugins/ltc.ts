import _ from 'lodash/fp'
import bitcoin from 'bitcoinjs-lib'

import { base58Validator, bech32Validator } from './validators'
import { CryptoPlugin } from './plugin'

class LTC implements CryptoPlugin {
  base58Opts = {
    bufferLength: 21,
    mainNetPrefix: [ [0x30], [0x32] ],
    testNetPrefix: [ [0x6f], [0x3a] ]
  }

  bech32Opts = {
    mainNetPrefix: 'ltc',
    testNetPrefix: 'tltc'
  }

  public parseUrl(network: string, url: string, opts?: any, fromMachine?: any): string | never {
    const res = /^(litecoin:\/{0,2})?(\w+)/.exec(url)
    const address = res && res[2]

    console.log('DEBUG16: *%s*', address)
    if (!address || !this.validate(network, address)) throw new Error('Invalid address')

    return address
  }

  public validate (network: string|null|undefined, address: string): boolean | never {
    if (!network) throw new Error('No network supplied.')
    return base58Validator(network, address, this.base58Opts)
      || bech32Validator(network, address, this.bech32Opts)
  }

  public getAddressType(url: string, network: string): string | null {
    const address = this.parseUrl(network, url)
    return base58Validator(network, address, this.base58Opts) ? 'P2PKH/PS2H' :
      bech32Validator(network, address, this.bech32Opts) ? 'SegWit' :
      null
  }
}

export default new LTC()
