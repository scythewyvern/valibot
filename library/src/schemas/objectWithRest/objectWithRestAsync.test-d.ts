import { describe, expectTypeOf, test } from 'vitest';
import type { ReadonlyAction } from '../../actions/index.ts';
import type { SchemaWithPipe } from '../../methods/index.ts';
import type { InferInput, InferIssue, InferOutput } from '../../types/index.ts';
import type { BooleanIssue, BooleanSchema } from '../boolean/index.ts';
import type { NullishSchema } from '../nullish/index.ts';
import {
  number,
  type NumberIssue,
  type NumberSchema,
} from '../number/index.ts';
import type { ObjectIssue, ObjectSchema } from '../object/index.ts';
import type { OptionalSchema } from '../optional/index.ts';
import {
  string,
  type StringIssue,
  type StringSchema,
} from '../string/index.ts';
import type { UndefinedableSchema } from '../undefinedable/index.ts';
import {
  objectWithRestAsync,
  type ObjectWithRestSchemaAsync,
} from './objectWithRestAsync.ts';
import type { ObjectWithRestIssue } from './types.ts';

describe('objectWithRestAsync', () => {
  describe('should return schema object', () => {
    const entries = { key: string() };
    type Entries = typeof entries;
    const rest = number();
    type Rest = typeof rest;

    test('with undefined message', () => {
      type Schema = ObjectWithRestSchemaAsync<Entries, Rest, undefined>;
      expectTypeOf(objectWithRestAsync(entries, rest)).toEqualTypeOf<Schema>();
      expectTypeOf(
        objectWithRestAsync(entries, rest, undefined)
      ).toEqualTypeOf<Schema>();
    });

    test('with string message', () => {
      expectTypeOf(objectWithRestAsync(entries, rest, 'message')).toEqualTypeOf<
        ObjectWithRestSchemaAsync<Entries, Rest, 'message'>
      >();
    });

    test('with function message', () => {
      expectTypeOf(
        objectWithRestAsync(entries, rest, () => 'message')
      ).toEqualTypeOf<ObjectWithRestSchemaAsync<Entries, Rest, () => string>>();
    });
  });

  describe('should infer correct types', () => {
    type Schema = ObjectWithRestSchemaAsync<
      {
        key1: StringSchema<undefined>;
        key2: OptionalSchema<StringSchema<undefined>, 'foo'>;
        key3: NullishSchema<StringSchema<undefined>, never>;
        key4: ObjectSchema<{ key: NumberSchema<undefined> }, never>;
        key5: SchemaWithPipe<[StringSchema<undefined>, ReadonlyAction<string>]>;
        key6: UndefinedableSchema<StringSchema<undefined>, 'bar'>;
      },
      BooleanSchema<undefined>,
      undefined
    >;

    test('of input', () => {
      expectTypeOf<InferInput<Schema>>().toEqualTypeOf<
        {
          key1: string;
          key2?: string;
          key3?: string | null | undefined;
          key4: { key: number };
          key5: string;
          key6: string | undefined;
        } & { [key: string]: boolean }
      >();
    });

    test('of output', () => {
      expectTypeOf<InferOutput<Schema>>().toEqualTypeOf<
        {
          key1: string;
          key2: string;
          key3?: string | null | undefined;
          key4: { key: number };
          readonly key5: string;
          key6: string;
        } & { [key: string]: boolean }
      >();
    });

    test('of issue', () => {
      expectTypeOf<InferIssue<Schema>>().toEqualTypeOf<
        | ObjectWithRestIssue
        | ObjectIssue
        | StringIssue
        | NumberIssue
        | BooleanIssue
      >();
    });
  });
});
