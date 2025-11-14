import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';
import { zestPoolsCV } from './helper/zestPoolParser';
import { fundTestWalletsWithSBTC, getOraclePriceFeed } from './helper/init';
import { initPythV4 } from './helper/initPyth';
import { deployer } from './settings/constants';
import {
  CURRENT_TEST_CONTRACT,
  mainnetContracts,
} from './settings/contracts';

describe('MaxStackDepth with Real Mainnet Contracts', () => {
  it('should demonstrate MaxStackDepth error in Clarity 4 with zest-withdraw', async () => {
    // Fund wallets with sBTC for testing
    await fundTestWalletsWithSBTC();

    initPythV4();

    const pools = zestPoolsCV;

    const transferToReserve = simnet.callPublicFn(
      mainnetContracts.tokens.sbtc,
      'transfer',
      [
        Cl.uint(50000000), // 0.5 sBTC
        Cl.standardPrincipal(deployer),
        Cl.principal(CURRENT_TEST_CONTRACT.reserve),
        Cl.none(),
      ],
      deployer
    );
    expect(transferToReserve.result).toBeOk(Cl.bool(true));

    const supplyResult = simnet.callPublicFn(
      CURRENT_TEST_CONTRACT.zest_interface,
      'zest-supply',
      [
        Cl.principal(mainnetContracts.zest.borrowHelperTrait),
        Cl.principal(mainnetContracts.zest.lpTokenZsbtc),
        Cl.principal(mainnetContracts.zest.poolReserve),
        Cl.principal(mainnetContracts.tokens.sbtc),
        Cl.uint(50000000), // 0.5 sBTC
        Cl.none(),
        Cl.principal(mainnetContracts.zest.incentives),
      ],
      deployer
    );
    expect(supplyResult.result).toBeOk(Cl.bool(true));

    simnet.mineEmptyBlocks(10);
    const currentBlockTimeWithdraw = Number(simnet.getBlockTime());
    const { vaa: stxVaaHexWithdraw } = await getOraclePriceFeed(
      currentBlockTimeWithdraw,
      'stx'
    );
    const { vaa: btcVaaHexWithdraw } = await getOraclePriceFeed(
      currentBlockTimeWithdraw,
      'btc'
    );

    const withdrawResult = simnet.callPublicFn(
      CURRENT_TEST_CONTRACT.trading,
      'zest-withdraw-fund',
      [
        Cl.principal(mainnetContracts.zest.borrowHelperTrait),
        Cl.principal(mainnetContracts.zest.lpTokenZsbtc),
        Cl.principal(mainnetContracts.tokens.sbtc),
        Cl.principal(mainnetContracts.zest.oracleStxBtc),
        Cl.principal(mainnetContracts.zest.incentives),
        Cl.uint(10000000), // 0.1 sBTC collateral (partial withdrawal)
        Cl.list([Cl.uint(1)]), // Claim ID 1
        Cl.principal(mainnetContracts.zest.poolReserve),
        pools,
        Cl.some(Cl.bufferFromHex(stxVaaHexWithdraw)),
        Cl.some(Cl.bufferFromHex(btcVaaHexWithdraw)),
      ],
      deployer
    );

    expect(withdrawResult.result).toBeOk(Cl.bool(true));
  }, 50000);
});
