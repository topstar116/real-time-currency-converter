export interface IStreamable<T> {
  get value(): T;

  toStringStream(transformer: (value: T) => string): StringStream;
  toArrayStream<D>(transformer: (value: T) => Array<D>): ArrayStream<D>;
}

export abstract class AbstractStreamable<T> implements IStreamable<T> {
  private readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  toStringStream(transformer: (value: T) => string): StringStream {
    return StringStream.of(transformer(this.value));
  }
  toArrayStream<D>(transformer: (value: T) => Array<D>): ArrayStream<D> {
    return ArrayStream.of(transformer(this.value));
  }
}

export class StringStream extends AbstractStreamable<string> {
  static of(value: string): StringStream {
    return new StringStream(value);
  }

  toStringStream(transformer: (value: string) => string): StringStream {
    return super.toStringStream(transformer);
  }

  toArrayStream<D>(transformer: (value: string) => Array<D>): ArrayStream<D> {
    return super.toArrayStream(transformer);
  }

  join(other: string): StringStream {
    return StringStream.of(this.value + other);
  }
  substringAfterLast(separator: string): StringStream {
    return StringStream.of(this.value.split(separator).pop() ?? "");
  }
}

export class ArrayStream<T> extends AbstractStreamable<Array<T>> {
  static of<T>(value: Array<T>): ArrayStream<T> {
    return new ArrayStream<T>(value);
  }
  toStringStream(transformer: (value: Array<T>) => string): StringStream {
    return super.toStringStream(transformer);
  }
  skip(index: number): ArrayStream<T> {
    const copy = [...this.value];
    copy.splice(index, 1);
    return ArrayStream.of(copy);
  }
}
