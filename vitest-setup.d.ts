import type {
  Assertion,
  AsymmetricMatchersContaining,
  ExpectStatic,
} from 'vitest';
import type { ClarityType, ClarityValue } from '@stacks/transactions';

interface ClarityValuesMatchers<R = unknown> {
  toHaveClarityType(expectedType: ClarityType): R;

  toBeOk(expected: ExpectStatic | ClarityValue): R;
  toBeErr(expected: ExpectStatic | ClarityValue): R;

  toBeSome(expected: ExpectStatic | ClarityValue): R;
  toBeNone(): R;

  toBeBool(expected: boolean): R;
  toBeInt(expected: number | bigint): R;
  toBeUint(expected: number | bigint): R;
  toBeAscii(expected: string): R;
  toBeUtf8(expected: string): R;
  toBePrincipal(expected: string): R;
  toBeBuff(expected: Uint8Array): R;

  toBeList(expected: ExpectStatic[] | ClarityValue[]): R;
  toBeTuple(expected: Record<string, ExpectStatic | ClarityValue>): R;
}

declare module 'vitest' {
  interface Assertion<T = any> extends ClarityValuesMatchers<T> {}
  interface AsymmetricMatchersContaining
    extends ClarityValuesMatchers<ExpectStatic> {}
}

// Global declarations for simnet and other clarinet-specific variables
declare global {
  var simnet: import('@stacks/clarinet-sdk').Simnet;
  var testEnvironment: string;
  var coverageReports: string[];
  var costsReports: string[];
  var options: {
    clarinet: {
      manifestPath: string;
      initBeforeEach: boolean;
      coverage: boolean;
      coverageFilename: string;
      costs: boolean;
      costsFilename: string;
      includeBootContracts: boolean;
      bootContractsPath: string;
    };
  };
}
