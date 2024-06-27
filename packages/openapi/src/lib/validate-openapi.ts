import type { OpenAPI } from '@aomex/core';
import stoplight, { type RulesetDefinition } from '@stoplight/spectral-core';
import { oas } from '@stoplight/spectral-rulesets';

// Inline package `@stoplight/types`
enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}

const spectral = new stoplight.Spectral();
spectral.setRuleset({
  extends: oas as RulesetDefinition,
  // https://github.com/stoplightio/spectral/blob/develop/packages/rulesets/src/oas/index.ts
  rules: {
    'info-contact': 'off',
    'info-description': 'off',
  },
});

export interface OpenapiValidateResultItem {
  path: string[];
  message: string;
}

export interface OpenapiValidateResult {
  errors: OpenapiValidateResultItem[];
  warnings: OpenapiValidateResultItem[];
}

export const validateOpenapi = async (document: OpenAPI.Document) => {
  const result: OpenapiValidateResult = {
    warnings: [],
    errors: [],
  };
  const originResult = await spectral.run(document as unknown as Record<string, unknown>);
  originResult.forEach((item) => {
    result[item.severity === DiagnosticSeverity.Error ? 'errors' : 'warnings'].push({
      path: item.path.map(String),
      message: item.message,
    });
  });
  return result;
};
