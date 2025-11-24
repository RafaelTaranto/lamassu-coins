export interface CryptoPlugin {
  parseUrl(network: string, url: string, opts?: any, fromMachine?: any): string | never;
  getAddressType(addr: string, network: string): string | null;

  //base58Opts
  //bech32Opts
  //validate
  //lengthLimit
  //opts
  //bech32mOpts
}
