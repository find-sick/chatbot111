// types/jsonwebtoken.d.ts
//告诉ts，jsonwebtoken模块存在

declare module 'jsonwebtoken' {
  import { SignOptions, VerifyOptions, Secret } from 'jsonwebtoken';

  export function sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: Secret,
    options?: SignOptions
  ): string;

  export function verify(
    token: string,
    secretOrPublicKey: Secret,
    options?: VerifyOptions
  ): object | string;
}