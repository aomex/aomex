import type { OpenAPI } from '@aomex/core';
import type spectral from '@stoplight/spectral-core';
import type ruleset from '@stoplight/spectral-rulesets';
import { createRequire } from 'node:module';

const requireCJS = createRequire(import.meta.url);

// Inline package `@stoplight/types`
enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}

let _spectral: spectral.Spectral | null = null;
const initSpectral = () => {
  if (!_spectral) {
    // 直接顶级import导致node启动时间慢100ms+
    const { Spectral } = requireCJS('@stoplight/spectral-core') as typeof spectral;
    const { oas } = requireCJS('@stoplight/spectral-rulesets') as typeof ruleset;
    _spectral = new Spectral();
    _spectral.setRuleset({
      extends: oas as spectral.RulesetDefinition,
      // https://github.com/stoplightio/spectral/blob/develop/packages/rulesets/src/oas/index.ts
      rules: {
        'info-contact': 'off',
        'info-description': 'off',
      },
    });
  }
  return _spectral;
};

export interface OpenapiValidateResultItem {
  path: string[];
  message: string;
}

export interface OpenapiValidateResult {
  errors: OpenapiValidateResultItem[];
  warnings: OpenapiValidateResultItem[];
}

export const validateOpenapi = async (document: OpenAPI.Document) => {
  const result: OpenapiValidateResult = { warnings: [], errors: [] };
  const spectral = initSpectral();
  const originResult = await spectral.run(document as unknown as Record<string, unknown>);
  originResult.forEach((item) => {
    result[item.severity === DiagnosticSeverity.Error ? 'errors' : 'warnings'].push({
      path: item.path.map(String),
      message: item.message,
    });
  });
  return result;
};
