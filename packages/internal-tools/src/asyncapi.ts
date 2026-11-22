import type { OpenAPIV3 } from 'openapi-types';

/**
 * AsyncAPI 3.x TypeScript 类型（自研，对齐规范 3.0.0 / 3.1.0 核心对象）。
 *
 * - Schema 复用 OpenAPI Schema（与 `@aomex/common` 校验器 `toDocument` 同形）
 * - 协议 Bindings 仅保留协议键占位，不展开各 binding 版本细节
 * - 规范扩展 `x-*` 未强制建模（避免与 OpenAPI Reference/Schema 赋值不兼容）；写入时允许任意多余键
 */
export namespace AsyncAPI {
  /** 复用校验器产出的 JSON Schema（与 OpenAPI Schema 同形） */
  export type SchemaObject = OpenAPIV3.SchemaObject;

  export interface ReferenceObject {
    $ref: string;
  }

  export type Referable<T> = T | ReferenceObject;

  export interface ContactObject {
    name?: string;
    url?: string;
    email?: string;
  }

  export interface LicenseObject {
    name: string;
    url?: string;
  }

  export interface ExternalDocumentationObject {
    url: string;
    description?: string;
  }

  export interface TagObject {
    name: string;
    description?: string;
    externalDocs?: Referable<ExternalDocumentationObject>;
  }

  export interface InfoObject {
    title: string;
    version: string;
    description?: string;
    termsOfService?: string;
    contact?: ContactObject;
    license?: LicenseObject;
    tags?: Array<Referable<TagObject>>;
    externalDocs?: Referable<ExternalDocumentationObject>;
  }

  export interface ServerVariableObject {
    enum?: string[];
    default?: string;
    description?: string;
    examples?: string[];
  }

  /** 协议绑定：仅协议键，值为不透明对象 */
  export type BindingMap = {
    [protocol: string]: object | undefined;
  };

  export type ServerBindingsObject = BindingMap;
  export type ChannelBindingsObject = BindingMap;
  export type OperationBindingsObject = BindingMap;
  export type MessageBindingsObject = BindingMap;

  export interface ServerObject {
    host: string;
    protocol: string;
    protocolVersion?: string;
    pathname?: string;
    title?: string;
    summary?: string;
    description?: string;
    variables?: Record<string, Referable<ServerVariableObject>>;
    security?: SecurityRequirements;
    tags?: Array<Referable<TagObject>>;
    externalDocs?: Referable<ExternalDocumentationObject>;
    bindings?: Referable<ServerBindingsObject>;
  }

  export interface ParameterObject {
    description?: string;
    enum?: string[];
    default?: string;
    examples?: string[];
    /** Runtime Expression，定位参数取值位置 */
    location?: string;
  }

  export interface CorrelationIdObject {
    location: string;
    description?: string;
  }

  /**
   * Multi Format Schema：显式声明 schema 语言时使用。
   * @see https://www.asyncapi.com/docs/reference/specification/v3.1.0#multiFormatSchemaObject
   */
  export interface MultiFormatSchemaObject {
    schemaFormat?: string;
    schema: SchemaObject | boolean | unknown;
  }

  /** Message / Trait 的 payload、headers：Schema、`$ref` 或 Multi Format Schema */
  export type AnySchemaObject =
    SchemaObject | ReferenceObject | MultiFormatSchemaObject | boolean;

  export interface MessageExampleObject {
    name?: string;
    summary?: string;
    headers?: Record<string, unknown>;
    payload?: unknown;
  }

  export interface MessageTraitObject {
    name?: string;
    title?: string;
    summary?: string;
    description?: string;
    deprecated?: boolean;
    contentType?: string;
    headers?: AnySchemaObject;
    correlationId?: Referable<CorrelationIdObject>;
    tags?: Array<Referable<TagObject>>;
    externalDocs?: Referable<ExternalDocumentationObject>;
    bindings?: Referable<MessageBindingsObject>;
    examples?: MessageExampleObject[];
  }

  export interface MessageObject extends MessageTraitObject {
    payload?: AnySchemaObject;
    traits?: Array<Referable<MessageTraitObject>>;
  }

  export interface ChannelObject {
    /** 通道地址；`null` 表示地址未定义（由绑定等决定） */
    address?: string | null;
    title?: string;
    summary?: string;
    description?: string;
    parameters?: Record<string, Referable<ParameterObject>>;
    messages?: Record<string, Referable<MessageObject>>;
    /** 引用本 Channel 可用的 Server（`$ref` → `#/servers/{name}`） */
    servers?: ReferenceObject[];
    tags?: Array<Referable<TagObject>>;
    externalDocs?: Referable<ExternalDocumentationObject>;
    bindings?: Referable<ChannelBindingsObject>;
  }

  export interface OperationReplyAddressObject {
    location: string;
    description?: string;
  }

  export interface OperationReplyObject {
    address?: Referable<OperationReplyAddressObject>;
    channel?: ReferenceObject;
    messages?: ReferenceObject[];
  }

  export interface OperationTraitObject {
    title?: string;
    summary?: string;
    description?: string;
    security?: SecurityRequirements;
    tags?: Array<Referable<TagObject>>;
    externalDocs?: Referable<ExternalDocumentationObject>;
    bindings?: Referable<OperationBindingsObject>;
  }

  export interface OperationObject extends OperationTraitObject {
    action: 'send' | 'receive';
    channel: ReferenceObject;
    messages?: ReferenceObject[];
    reply?: Referable<OperationReplyObject>;
    traits?: Array<Referable<OperationTraitObject>>;
  }

  // —— Security ——

  export interface UserPasswordSecurityScheme {
    type: 'userPassword';
    description?: string;
  }

  export interface ApiKeySecurityScheme {
    type: 'apiKey';
    in: 'user' | 'password';
    description?: string;
  }

  export interface X509SecurityScheme {
    type: 'X509';
    description?: string;
  }

  export interface SymmetricEncryptionSecurityScheme {
    type: 'symmetricEncryption';
    description?: string;
  }

  export interface AsymmetricEncryptionSecurityScheme {
    type: 'asymmetricEncryption';
    description?: string;
  }

  export interface HttpBearerSecurityScheme {
    type: 'http';
    scheme: 'bearer';
    bearerFormat?: string;
    description?: string;
  }

  export interface HttpSecurityScheme {
    type: 'http';
    scheme: string;
    description?: string;
  }

  export interface HttpApiKeySecurityScheme {
    type: 'httpApiKey';
    name: string;
    in: 'header' | 'query' | 'cookie';
    description?: string;
  }

  export type HttpSecuritySchemeObject =
    HttpBearerSecurityScheme | HttpSecurityScheme | HttpApiKeySecurityScheme;

  export interface OAuth2ScopesObject {
    [scope: string]: string;
  }

  export interface OAuth2FlowObject {
    authorizationUrl?: string;
    tokenUrl?: string;
    refreshUrl?: string;
    availableScopes?: OAuth2ScopesObject;
  }

  export interface OAuth2SecurityScheme {
    type: 'oauth2';
    description?: string;
    flows: {
      authorizationCode?: OAuth2FlowObject;
      clientCredentials?: OAuth2FlowObject;
      implicit?: OAuth2FlowObject;
      password?: OAuth2FlowObject;
    };
  }

  export interface OpenIdConnectSecurityScheme {
    type: 'openIdConnect';
    openIdConnectUrl: string;
    description?: string;
    scopes?: string[];
  }

  export interface SaslPlainSecurityScheme {
    type: 'plain';
    description?: string;
  }

  export interface SaslScramSecurityScheme {
    type: 'scramSha256' | 'scramSha512';
    description?: string;
  }

  export interface SaslGssapiSecurityScheme {
    type: 'gssapi';
    description?: string;
  }

  export type SaslSecurityScheme =
    SaslPlainSecurityScheme | SaslScramSecurityScheme | SaslGssapiSecurityScheme;

  export type SecuritySchemeObject =
    | UserPasswordSecurityScheme
    | ApiKeySecurityScheme
    | X509SecurityScheme
    | SymmetricEncryptionSecurityScheme
    | AsymmetricEncryptionSecurityScheme
    | HttpSecuritySchemeObject
    | OAuth2SecurityScheme
    | OpenIdConnectSecurityScheme
    | SaslSecurityScheme;

  /** 规范中 security 为 Scheme / Reference 数组（3.x） */
  export type SecurityRequirements = Array<Referable<SecuritySchemeObject>>;

  export interface ComponentsObject {
    schemas?: Record<string, Referable<SchemaObject>>;
    servers?: Record<string, Referable<ServerObject>>;
    channels?: Record<string, Referable<ChannelObject>>;
    operations?: Record<string, Referable<OperationObject>>;
    messages?: Record<string, Referable<MessageObject>>;
    securitySchemes?: Record<string, Referable<SecuritySchemeObject>>;
    serverVariables?: Record<string, Referable<ServerVariableObject>>;
    parameters?: Record<string, Referable<ParameterObject>>;
    correlationIds?: Record<string, Referable<CorrelationIdObject>>;
    replies?: Record<string, Referable<OperationReplyObject>>;
    replyAddresses?: Record<string, Referable<OperationReplyAddressObject>>;
    externalDocs?: Record<string, Referable<ExternalDocumentationObject>>;
    tags?: Record<string, Referable<TagObject>>;
    operationTraits?: Record<string, Referable<OperationTraitObject>>;
    messageTraits?: Record<string, Referable<MessageTraitObject>>;
    serverBindings?: Record<string, Referable<ServerBindingsObject>>;
    channelBindings?: Record<string, Referable<ChannelBindingsObject>>;
    operationBindings?: Record<string, Referable<OperationBindingsObject>>;
    messageBindings?: Record<string, Referable<MessageBindingsObject>>;
  }

  export interface Document {
    asyncapi: '3.0.0' | '3.1.0';
    /** 应用标识（URI） */
    id?: string;
    info: InfoObject;
    defaultContentType?: string;
    servers?: Record<string, Referable<ServerObject>>;
    channels?: Record<string, Referable<ChannelObject>>;
    operations?: Record<string, Referable<OperationObject>>;
    components?: ComponentsObject;
  }
}
