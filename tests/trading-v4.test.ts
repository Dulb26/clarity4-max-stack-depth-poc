import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';
import { zestPoolsCV } from './helper/zestPoolParser';
import { fundTestWalletsWithSBTC, getOraclePriceFeed } from './helper/init';
import { initPythV4 } from './helper/initPyth';
import { deployer } from './settings/constants';
import {
  CURRENT_TEST_CONTRACT_V4,
  mainnetContracts,
} from './settings/contracts';

describe('MaxStackDepth with Real Mainnet Contracts - Clarity 4', () => {
  it('should demonstrate MaxStackDepth error in Clarity 4 with zest-withdraw', async () => {
    // Fund wallets with sBTC for testing
    await fundTestWalletsWithSBTC();

    // Setup: Initialize Pyth oracle for price feeds
    initPythV4();

    // Get oracle price feeds
    const currentBlockTime = Number(simnet.getBlockTime());
    const { vaa: btcVaaHex } = await getOraclePriceFeed(
      currentBlockTime,
      'btc'
    );
    const { vaa: stxVaaHex } = await getOraclePriceFeed(
      currentBlockTime,
      'stx'
    );

    const pools = zestPoolsCV;

    // Transfer sBTC to reserve first
    const transferToReserve = simnet.callPublicFn(
      mainnetContracts.tokens.sbtc,
      'transfer',
      [
        Cl.uint(50000000), // 0.5 sBTC
        Cl.standardPrincipal(deployer),
        Cl.principal(CURRENT_TEST_CONTRACT_V4.reserve),
        Cl.none(),
      ],
      deployer
    );
    expect(transferToReserve.result).toBeOk(Cl.bool(true));

    // Use zest-supply to supply from reserve through zest-interface
    // This ensures the LP tokens end up owned by zest-interface (which calls as-contract)
    const supplyResult = simnet.callPublicFn(
      CURRENT_TEST_CONTRACT_V4.zest_interface,
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

    // Advance blocks for withdrawal
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

    // THIS IS THE CALL THAT HITS MaxStackDepth IN CLARITY 4
    console.log(
      '\n🔴 ATTEMPTING CLARITY 4 WITHDRAW (Expected to hit MaxStackDepth)...\n'
    );

    // Call zest-withdraw-fund on the trading contract (mimics root repo flow)
    // This matches: trading.zest-withdraw-fund -> zest-interface.zest-withdraw (line 176 in dev-trading-v0-1.clar)
    const withdrawResult = simnet.callPublicFn(
      CURRENT_TEST_CONTRACT_V4.trading,
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

    // Log the result to see what we get
    console.log('Withdraw result:', withdrawResult.result);

    // Check if we hit MaxStackDepth like the root repo does
    // The root repo test fails with: Runtime(MaxStackDepthReached, ...)
    // If Clarity 4 fixes this, the test will pass
    // If Clarity 4 has the same issue, the test will fail with MaxStackDepth
    expect(withdrawResult.result).toBeOk(Cl.bool(true));
  }, 50000);
});
