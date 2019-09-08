import Transpiler from "../src/transpiler";

function format(text: string) {
  return text.split('\n')
    .map(l => l.trim())
    .filter(l => l)
    .join('\n');
}

function expectTranspile(ast, result) {
  expect(format(new Transpiler().transpile(ast)))
    .toBe(format(result));
}

function expectThrow(ast, error = SyntaxError) {
  expect(() => new Transpiler().transpile(ast))
    .toThrow(error);
}

describe(Transpiler, () => {
  describe('simple commands', () => {
    test('lock with no children', () => {
      expectTranspile([{
        command: 'lock',
      }], `lock`);
    });

    test('lock with children', () => {
      expectTranspile([{
        command: 'lock',
        children: [{
          command: 'hello'
        }]
      }], `
        lock
        hello
        release
      `);
    })
  });

  describe('script command', () => {
    test('script with no children', () => {
      expectThrow([{
        command: 'script',
      }]);
    });

    test('script with no parameters', () => {
      expectThrow([{
        command: 'script',
        children: [{ command: 'xd' }],
      }]);
    });

    test('script with the wrong number of parameters', () => {
      expectThrow([{
        command: 'script',
        parameters: [
          { type: 'string', value: 'a'}, 
          { type: 'string', value: 'b' }
        ],
        children: [{ command: 'xd' }],
      }]);
    });

    test('script with the wrong parameter type', () => {
      expectThrow([{
        command: 'script',
        parameters: [{ type: 'string', value: 'xd' }],
        children: [{ command: 'xd' }],
      }]);
    });

    test('basic working script', () => {
      expectTranspile([{
        command: 'script',
        parameters: [{ type: 'token', value: 'MyScript' }],
        children: [{ command: 'xd' }],
      }], `
        MyScript::
          xd
          end
      `);
    });
  });
});