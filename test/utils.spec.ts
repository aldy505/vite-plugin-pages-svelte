import { slash, pathToName, toArray } from '../src/utils/convert';
import { isDynamicRoute, isCatchAllRoute } from '../src/utils/validate';

describe('Utils', () => {
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

  test('toArray', () => {
    expect(toArray('foo')).toStrictEqual(['foo']);
    expect(toArray(['foo', 'bar'])).toStrictEqual(['foo', 'bar']);
  });
});
