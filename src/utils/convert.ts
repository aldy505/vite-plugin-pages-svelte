import type { OutputBundle } from 'rollup';
import { basename } from 'path';

export function pathToName(filepath: string): string {
  return filepath.replace(/[_.\-\\/]/g, '_').replace(/[[:\]()]/g, '$');
}

export function replaceSquareBrackets(bundle: OutputBundle): void {
  const files = Object.keys(bundle).map((i) => basename(i));
  for (const chunk of Object.values(bundle)) {
    chunk.fileName = chunk.fileName.replace(/(\[|\])/g, '_');
    if (chunk.type === 'chunk') {
      for (const file of files) chunk.code = chunk.code.replace(file, file.replace(/(\[|\])/g, '_'));
    }
  }
}

export function slash(str: string): string {
  return str.replace(/\\/g, '/');
}

type Nullable<T> = T | null | undefined;
type Arrayable<T> = T | T[];

export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array || [];
  if (Array.isArray(array)) return array;
  return [array];
}
