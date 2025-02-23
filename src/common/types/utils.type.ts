import { Prisma, PrismaClient, PrismaPromise } from '@modules/prisma';

export interface Obj {
  [key: string]: any;
}

export type AnyFunction = (...args: any[]) => any;

export type RemoveNeverProperties<T> = Omit<
  T,
  {
    [K in keyof T]: T[K] extends never ? K : never;
  }[keyof T]
>;

export type RequiredNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export type MakeOptionalWithPrefix<
  T,
  K extends string,
  U extends string = K | `_${K}`,
> = Omit<T, U> & Partial<Pick<T, Extract<keyof T, U>>>;

export type GetDelegate<T> = RemoveNeverProperties<{
  [K in keyof T]: T[K] extends { [key: string]: any }
    ? T[K]['findUnique'] extends (...args: any[]) => any
      ? K
      : never
    : never;
}>;

export type PrismaTables = keyof GetDelegate<PrismaClient>;

export type GetModelType<T extends PrismaTables> =
  ReturnType<PrismaClient[T]['create']> extends PrismaPromise<infer U>
    ? U
    : never;

type UnpackSubset<T> = T extends Prisma.Subset<any, infer V> ? V : T;

export type GetWhereInput<T extends PrismaTables> = NonNullable<
  NonNullable<UnpackSubset<Parameters<PrismaClient[T]['count']>[0]>>['where']
>;

export type GetWhereUniqueInput<T extends PrismaTables> = NonNullable<
  UnpackSubset<Parameters<PrismaClient[T]['findUnique']>[0]> extends {
    where: infer W;
  }
    ? W
    : never
>;

export type GetCreateInput<T extends PrismaTables> = NonNullable<
  UnpackSubset<Parameters<PrismaClient[T]['create']>[0]> extends {
    data: infer D;
  }
    ? D
    : never
>;

export type AllPrismaModels = {
  [K in PrismaTables]: GetModelType<K>;
};

export type AllPrismaWhereInput = {
  [K in PrismaTables]: GetWhereInput<K>;
};

export type AllPrismaWhereUniqueInput = {
  [K in PrismaTables]: GetWhereUniqueInput<K>;
};

export type $Values<T extends Obj> = T[keyof T];

export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]-?: T[Key] extends ValueType ? Key : never }[keyof T]
>;

export type PrimitiveKeys<T> = keyof PickByValue<T, string>;

export type RequiredKeys<T> = {
  [K in keyof T]-?: Obj extends Pick<T, K> ? never : K;
}[keyof T];

export type RemoveNullKeys<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type RemoveSomeUndefined<T, K extends keyof T> = RemoveNullKeys<
  Pick<T, K>
> &
  Omit<T, K>;

export type MakeAllUndefined<T> = {
  [K in keyof T]: T[K] | undefined;
};

export type NonNullKeys<T> = RemoveSomeUndefined<
  MakeAllUndefined<Required<T>>,
  RequiredKeys<T>
>;
