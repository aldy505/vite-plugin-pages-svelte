import { extensionsToGlob, slash, isDynamicRoute, isCatchAllRoute, pathToName } from '../src/utils';

describe('Utils', () => {
  test('Extensions to glob', () => {
    expect(extensionsToGlob(['svelte', 'ts', 'js'])).toBe('{svelte,ts,js}');
  });
  test('Normalize path', () => {
    expect(slash('C:\\project\\from\\someone')).toBe('C:/project/from/someone');
  });
  test('Dynamic route', () => {
    expect(isDynamicRoute('[id]')).toBe(true);
    expect(isDynamicRoute('me')).toBe(false);
  });
  test('Catch all route', () => {
    expect(isCatchAllRoute('[...all]')).toBe(true);
    expect(isCatchAllRoute('[id]')).toBe(false);
  });
  test('Path to name', () => {
    expect(pathToName('user-[route]-current')).toBe('user_$route$_current');
  });
});
