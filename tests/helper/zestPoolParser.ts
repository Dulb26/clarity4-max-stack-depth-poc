// Build Clarity list<tuple{ asset: principal, lp_token: principal, oracle: principal }>
import { Cl } from '@stacks/transactions';
import poolsJson from './zestPools.json';

type ZestPool = { asset: string; lp_token: string; oracle: string };
const zestPools: ZestPool[] = (poolsJson as { pools: ZestPool[] }).pools;

const toContractPrincipal = (id: string) => {
  const [address, name] = id.split('.');
  if (!address || !name) throw new Error(`Invalid contract id: ${id}`);
  return Cl.contractPrincipal(address, name);
};

export const zestPoolsCV = Cl.list(
  zestPools.map(({ asset, lp_token, oracle }) =>
    Cl.tuple({
      asset: toContractPrincipal(asset),
      'lp-token': toContractPrincipal(lp_token),
      oracle: toContractPrincipal(oracle),
    })
  )
);