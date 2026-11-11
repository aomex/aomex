import type { OpenAPI } from '@aomex/common';

/**
 * 识别 schema 上的 `x-ref`，提取到 `components.schemas`，并替换为 `$ref`。
 * 自底向上处理，保证嵌套 object 先变成 `$ref` 再被父级收录。
 */
export const hoistSchemaRef = (document: OpenAPI.Document) => {
  document.components ||= {};
  document.components.schemas ||= {};
  const seen = new Map<string, string>();

  const resolveName = (base: string, canonical: string, schema: OpenAPI.SchemaObject) => {
    let name = base;
    let suffix = 2;
    while (true) {
      const existing = document.components!.schemas![name];
      if (!existing) {
        document.components!.schemas![name] = schema;
        seen.set(name, canonical);
        return name;
      }
      const existingCanonical = seen.get(name) ?? JSON.stringify(existing);
      if (existingCanonical === canonical) return name;
      if (name === base) {
        console.warn(
          `OpenAPI schema component name conflict: "${base}" refers to different schemas, renaming to "${base}-duplicated-${suffix}"`,
        );
      }
      name = `${base}-duplicated-${suffix++}`;
    }
  };

  const visit = (node: unknown): void => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    const obj = node as Record<string, unknown>;
    for (const value of Object.values(obj)) {
      visit(value);
    }

    const refName = obj['x-ref'];
    if (typeof refName !== 'string' || '$ref' in obj) return;

    const { 'x-ref': _, ...rest } = obj;
    const cleaned: OpenAPI.SchemaObject = JSON.parse(JSON.stringify(rest));
    const canonical = JSON.stringify(cleaned);
    const name = resolveName(refName, canonical, cleaned);

    for (const key of Object.keys(obj)) {
      delete obj[key];
    }
    obj['$ref'] = `#/components/schemas/${name}`;
  };

  visit(document.paths);

  if (!Object.keys(document.components.schemas).length) {
    delete document.components.schemas;
    if (!Object.keys(document.components).length) {
      delete document.components;
    }
  }
};
