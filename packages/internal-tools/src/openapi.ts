import type * as ScalarOpenAPI from '@scalar/openapi-types/3.2';

export class OpenAPI {
  private constructor() {}
}

export namespace OpenAPI {
  export type ApiKeySecuritySchemeObject = ScalarOpenAPI.TypeApikeyObject;
  export type AuthorizationCodeOauthFlowObject = ScalarOpenAPI.AuthorizationCodeObject;
  export type CallbackObject = ScalarOpenAPI.CallbacksObject;
  export type ClientCredentialsFlowObject = ScalarOpenAPI.ClientCredentialsObject;
  export type ComponentsObject = ScalarOpenAPI.ComponentsObject;
  export type ContactObject = ScalarOpenAPI.ContactObject;
  export type CookieParameterObject = ScalarOpenAPI.ParameterObject & { in: 'cookie' };
  export type DiscriminatorObject = Record<string, unknown>;
  export type Document = Omit<ScalarOpenAPI.Document, 'paths'> & {
    paths: PathsObject;
  };
  export type EncodingObject = ScalarOpenAPI.EncodingObject;
  export type ExampleObject = ScalarOpenAPI.ExampleObject;
  export type Extensions = ScalarOpenAPI.Extensions;
  export type ExternalDocumentationObject = ScalarOpenAPI.ExternalDocumentationObject;
  export type HeaderObject = ScalarOpenAPI.HeaderObject;
  export type HeaderParameterObject = ScalarOpenAPI.ParameterObject & { in: 'header' };
  export type HttpSecuritySchemeObject =
    ScalarOpenAPI.TypeHttpObject | ScalarOpenAPI.TypeHttpBearerObject;
  export type ImplicitOauthFlowObject = ScalarOpenAPI.ImplicitObject;
  export type InfoObject = ScalarOpenAPI.InfoObject;
  export type LicenseObject = ScalarOpenAPI.LicenseObject;
  export type LinkObject = ScalarOpenAPI.LinkObject;
  export type MediaTypeObject = ScalarOpenAPI.MediaTypeObject;
  export type NumericFormat = ScalarOpenAPI.NumericFormat;
  export type OauthFlowsObject = ScalarOpenAPI.OauthFlowsObject;
  export type Oauth2SecuritySchemeObject = ScalarOpenAPI.TypeOauth2Object;
  export type OpenIdConnectSecuritySchemeObject = ScalarOpenAPI.TypeOidcObject;
  export type OperationObject = Omit<ScalarOpenAPI.OperationObject, 'responses'> & {
    responses: ScalarOpenAPI.ResponsesObject;
  };
  export type ParameterObject = ScalarOpenAPI.ParameterObject;
  export type PasswordOauthFlowObject = ScalarOpenAPI.PasswordObject;
  export type PathItemObject = {
    [Key in keyof ScalarOpenAPI.PathItemObject]: NonNullable<
      ScalarOpenAPI.PathItemObject[Key]
    > extends ScalarOpenAPI.OperationObject
      ? OperationObject
      : ScalarOpenAPI.PathItemObject[Key];
  };
  export type PathParameterObject = ScalarOpenAPI.ParameterObject & { in: 'path' };
  export type PathsObject = Record<string, PathItemObject>;
  export type PrimitiveSchemaType = ScalarOpenAPI.PrimitiveSchemaType;
  export type QueryParameterObject = ScalarOpenAPI.ParameterObject & {
    in: 'query' | 'querystring';
  };
  export type ReferenceObject = ScalarOpenAPI.ReferenceObject;
  export type RequestBodyObject = ScalarOpenAPI.RequestBodyObject;
  export type ResponseObject = ScalarOpenAPI.ResponseObject;
  export type ResponsesObject = ScalarOpenAPI.ResponsesObject;
  export type SchemaObject = Exclude<ScalarOpenAPI.SchemaObject, boolean> & {
    nullable?: never;
  };
  export type SecurityRequirementObject = ScalarOpenAPI.SecurityRequirementObject;
  export type SecuritySchemeObject = ScalarOpenAPI.SecuritySchemeObject;
  export type SchemaReferenceType<Value> = ScalarOpenAPI.SchemaReferenceType<Value>;
  export type ServerObject = ScalarOpenAPI.ServerObject;
  export type ServerVariableObject = ScalarOpenAPI.ServerVariableObject;
  export type StringFormat = ScalarOpenAPI.StringFormat;
  export type TagObject = ScalarOpenAPI.TagObject;
}
