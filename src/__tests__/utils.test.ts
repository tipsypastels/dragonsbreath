import { trimAndKeepIndents } from "../utils";

describe(trimAndKeepIndents, () => {
  test('simple test', () => {
    expect(trimAndKeepIndents('    a\n      b'))
      .toBe('a\n  b');
  });

  test('lines with no indents', () => {
    expect(trimAndKeepIndents('a\nb')).toBe('a\nb');
  })
});