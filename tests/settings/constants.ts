export const base = {
    sBTC: 10**8, // 1 sBTC = 100,000,000 satoshis
    hBTC: 10**8, // 1 hBTC = 100,000,000 micro units
    USDh: 10**8, // 1 USDh = 100,000,000 micro units
    sUSDh: 10**8, // 1 sUSDh = 100,000,000 micro units
    oracle: 10**8, // 1 oracle = 100,000,000 micro unit
    bps: 10**4, // 10000 basis point = 100%
    STX: 10**6, // 1 STX = 1,000,000 micro units
    aeUSDC: 10**6, // 1 aeUSDC = 1,000,000 micro units
}

export const PYTH_ASSET_IDS = {
    btc: '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    stx: '0xec7a775f46379b5e943c3526b1c8d54cd49749176b0b98e02dde68d1bd335c17',
    usdc: '0xeaa020c61cc479712813461ce153894a96a6c00b21ed0cfc2798d1f9a9e9c94a'
  } as const;
  
export const sbtcTokenAddress = "SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token";

export const [deployer, wallet_1, wallet_2, wallet_3] = ['deployer', 'wallet_1', 'wallet_2', 'wallet_3'].map(who => simnet.getAccounts().get(who)!);

export const mainnetUser1 = "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9";
export const mainnetUser2 = "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7";

export const nonStandardAddress = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";

export const SBTC_FUNDING_DELAY = 1000;

export const TESTS_TIMEOUT = SBTC_FUNDING_DELAY + 500000;
