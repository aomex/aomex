/** `oidc-token-hash` 无官方类型；仅声明本包用到的 API */
declare module 'oidc-token-hash' {
  export function validate(
    names: { claim: string; source: string },
    actual: string,
    source: string,
    alg: string,
    crv?: string,
  ): void;

  export function generate(token: string, alg: string, crv?: string): string;
}
