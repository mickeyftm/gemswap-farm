import tokens from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'GEM',
    lpAddresses: {
      322: '',
      321: '0x8c5ce6129372bd55e03d74831bda9dd4ff40bd62',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 0,
    lpSymbol: 'GEM/KCS',
    lpAddresses: {
      322: '',
      321: '0x82d8f911bf300878f55600616e54036c178b412c',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  }
]

export default farms
