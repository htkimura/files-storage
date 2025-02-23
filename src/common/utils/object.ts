import { Obj } from '@common/types';

export function mapByKey<T extends Obj, K extends keyof T>(
  arr: T[],
  key: K,
): Record<T[K], T> {
  const result: Record<K, T> = {} as Record<K, T>;

  arr.forEach((item) => {
    result[item[key]] = item;
  });

  return result;
}
