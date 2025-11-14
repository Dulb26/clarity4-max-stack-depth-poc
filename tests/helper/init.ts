import { Cl } from '@stacks/transactions';
import { expect } from 'vitest';
import {
  deployer,
  sbtcTokenAddress,
  SBTC_FUNDING_DELAY,
} from '../settings/constants';
import { PYTH_ASSET_IDS } from '../settings/constants.ts';

// Helper function to fund test wallets with sBTC using the deposit mechanism
export async function fundTestWalletsWithSBTC() {
  await new Promise(resolve => setTimeout(resolve, SBTC_FUNDING_DELAY));
  const sbtcWallet = 'SM6SY6KSS5WJM0FT6FKNQ0GF8NM9HJZAWSZWJDQV'; // use sbtc from this wallet and transfer 10 btc for each: deployer, wallet_1

  const transferSbtc = simnet.callPublicFn(
    sbtcTokenAddress,
    'transfer',
    [
      Cl.uint(100 * 10 ** 8),
      Cl.principal(sbtcWallet),
      Cl.principal(deployer),
      Cl.none(),
    ],
    sbtcWallet
  );
  expect(transferSbtc.result).toBeOk(Cl.bool(true));
}

export async function getOraclePriceFeed(
  timestamp: number,
  asset: 'btc' | 'stx' | 'usdc'
): Promise<{ vaa: string; price: number }> {
  const selectedAssetId = PYTH_ASSET_IDS[asset];

  if (!selectedAssetId) {
    throw new Error(
      `Invalid asset: ${asset}. Valid options: ${Object.keys(PYTH_ASSET_IDS).join(', ')}`
    );
  }

  // Check if timestamp is in the future
  const currentTime = Math.floor(Date.now() / 1000);
  if (timestamp > currentTime) {
    throw new Error(
      `Timestamp ${timestamp} is in the future (current: ${currentTime}). Oracle data is not available for future timestamps.`
    );
  }

  const timestampURL = `https://hermes.pyth.network/api/get_price_feed?id[]=${selectedAssetId}&publish_time=${timestamp}&binary=true`;

  // Retry with exponential backoff
  const maxRetries = 5;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(timestampURL);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(
          `Invalid content type. Expected JSON, got: ${contentType}. Response: ${text.substring(0, 200)}`
        );
      }

      const data = (await response.json()) as {
        vaa: string;
        price: { price: number };
      };

      if (!data.vaa || !data.price) {
        throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
      }

      const vaa = Buffer.from(data.vaa, 'base64').toString('hex');
      return { vaa, price: data.price.price };
    } catch (error) {
      retryCount++;
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (retryCount >= maxRetries) {
        console.log(`\n❌ ORACLE FETCH FAILED - Manual Debug Info:`);
        console.log(`  Asset: ${asset}`);
        console.log(`  Asset ID: ${selectedAssetId}`);
        console.log(`  Timestamp: ${timestamp}`);
        console.log(`  Full URL: ${timestampURL}`);
        console.log(`  You can test this URL manually in your browser or curl`);
        throw new Error(
          `Failed to fetch oracle data after ${maxRetries} attempts. Last error: ${errorMessage}`
        );
      }

      // Exponential backoff: 1s, 2s, 4s, 8s, 16s
      const delay = Math.pow(2, retryCount - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new Error('Unexpected end of function');
}
