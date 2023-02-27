import { Transform, TransformCallback } from 'node:stream';

export class Counter extends Transform {
  public length: number = 0;

  override _transform(
    chunk: any,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    this.length += chunk.length;
    this.push(chunk);
    callback();
  }
}
