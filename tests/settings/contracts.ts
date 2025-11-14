import { deployer } from "./constants";

export const contract = {
  v4: {
    reserve:             `${deployer}.reserve-v4`,
    zest_interface:      `${deployer}.zest-interface-v4`,
    trading:             `${deployer}.trading-v4`,
  },
  v3: {
    reserve:             `${deployer}.reserve-v3`,
    zest_interface:      `${deployer}.zest-interface-v3`,
    trading:             `${deployer}.trading-v3`,
  },
}

export const mainnetContracts = {
  zest: {
    borrowHelperTrait:  "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.borrow-helper-v2-1-7",
    poolReserve:        "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-0-reserve-v2-0",
    lpTokenZsbtc:       "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.zsbtc-v2-0",
    lpTokenZusdh:       "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.zusdh-v2-0",
    oracleStxBtc:       "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.stx-btc-oracle-v1-3",
    oracleUsdh:         "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.usdh-oracle-v1-0",
    incentives:         "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.incentives-v2-2", // concrete implementation (passed to functions)
    feeCalculator:      "SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG.fees-calculator",
    poolReadSupply:     "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-read-supply-v2-1-3", // pool read supply
    poolRead:           "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-read-v2-1-4", // pool read
    poolBorrow:         "SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.pool-borrow-v2-4", // pool borrow
  },
  tokens: {
    usdh: 'SPN5AKG35QZSK2M8GAMR4AFX45659RJHDW353HSG.usdh-token-v1', // stableswap pool y token
    aeusdc: 'SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc', // stableswap pool x token
    sbtc: 'SM3VDXK3WZZSA84XXFKAFAF15NNZX32CTSG82JFQ4.sbtc-token',
  },
  pythV4: {
    pythOracle: "SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-oracle-v4",
    pythStorage: "SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-storage-v4",
    pythDecoder: "SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.pyth-pnau-decoder-v3",
    wormholeCore: "SP1CGXWEAMG6P6FT04W66NVGJ7PQWMDAC19R7PJ0Y.wormhole-core-v4",
    feeAddress: "SP3CRXBDXQ2N5P7E25Q39MEX1HSMRDSEAP3CFK2Z3"
  }
}

// Asset identifiers for hBTC protocol
export const CURRENT_TEST_CONTRACT_V3 = contract.v3;
export const CURRENT_TEST_CONTRACT_V4 = contract.v4;