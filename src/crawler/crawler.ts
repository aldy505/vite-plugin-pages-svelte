import { opendir } from 'fs/promises';
import { resolve, extname } from 'path';
import type { FileOutput } from '../types/page';
import { containsExtension } from '../utils/validate';

export async function traverse(path: string, extensions: string[], ignore: string[]): Promise<FileOutput[]> {
  const r: FileOutput[] = [];
  const dir = await opendir(path, { bufferSize: 64 });
  for await (const dirent of dir) {
    if (dirent.isFile()) {
      if (ignore.includes(dirent.name)) continue;
      if (extensions.length > 0 && !containsExtension(dirent.name, extensions)) continue;
      r.push({ path: resolve(path, dirent.name) });
    } else if (dirent.isDirectory()) {
      if (ignore.includes(dirent.name)) continue;
      r.push({
        path: resolve(path, dirent.name),
        children: await traverse(resolve(path, dirent.name), extensions, ignore),
      });
    }
  }
  return r;
}

export async function traverseDir(path: string, ignore: string[]): Promise<string[]> {
  // If it's a file, then do nothing.
  if (extname(path)) return [];

  const d: string[] = [];
  const dir = await opendir(path, { bufferSize: 64 });
  for await (const dirent of dir) {
    if (dirent.isDirectory()) {
      if (ignore.includes(dirent.name)) continue;
      d.push(dirent.name);
    }
  }
  return d;
}

export function haveChildren(files: FileOutput): boolean {
  if (files.children && Array.isArray(files.children) && files.children.length > 0) return true;
  return false;
}
