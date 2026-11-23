import type { AsyncAPI } from '@aomex/common';
import type spectral from '@stoplight/spectral-core';
import type ruleset from '@stoplight/spectral-rulesets';
import { createRequire } from 'node:module';

const requireCJS = createRequire(import.meta.url);

enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3,
}

let _spectral: spectral.Spectral | null = null;
const initSpectral = () => {
  if (!_spectral) {
    const { Spectral } = requireCJS('@stoplight/spectral-core') as typeof spectral;
    const { asyncapi } = requireCJS('@stoplight/spectral-rulesets') as typeof ruleset;
    _spectral = new Spectral();
    _spectral.setRuleset({
      extends: asyncapi as spectral.RulesetDefinition,
    });
  }
  return _spectral;
};

export interface AsyncapiValidateResultItem {
  path: string[];
  message: string;
}

export interface AsyncapiValidateResult {
  errors: AsyncapiValidateResultItem[];
  warnings: AsyncapiValidateResultItem[];
}

export const validateAsyncapi = async (document: AsyncAPI.Document) => {
  const result: AsyncapiValidateResult = { warnings: [], errors: [] };
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
