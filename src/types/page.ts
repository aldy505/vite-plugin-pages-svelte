export interface PageDirOptions {
  dir: string;
  baseRoute: string;
}

export interface ResolvedPage {
  dir: string;
  route: string;
  extension: string;
  filepath: string;
  component: string;
}

export type ResolvedPages = Map<string, ResolvedPage>;

export interface FileOutput {
  path: string;
  children?: FileOutput[];
}
