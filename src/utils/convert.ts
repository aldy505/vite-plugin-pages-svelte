import type { OutputBundle } from 'rollup';
import { basename } from 'path';

/**
 * Generate a name from a given path (so it won't mess with Javascript).
 * @param filepath 
 * @returns 
 */
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

/**
 * This is originally came from @antfu/utils.
 * But have we forget how to program? This is so simple, man!
 * 
 * Basically converts Windows-like slashes to UNIX-like.
 * @param {String} str
 * @returns {String}
 */
export function slash(str: string): string {
  return str.replace(/\\/g, '/');
}

type Nullable<T> = T | null | undefined;
type Arrayable<T> = T | T[];

/**
 * This is originally came from @antfu/utils.
 * But adding more dependency just to import this is not that worth it.
 * 
 * Convert a string or array to array type.
 * @param array 
 * @returns 
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array || [];
  if (Array.isArray(array)) return array;
  return [array];
}
