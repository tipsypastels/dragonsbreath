import Transpiler from "../src/transpiler";
import Line from "../src/line";

const IF_PARAMS_STUB = [{
  type: 'eq', value: {
    left: { type: 'string', value: 'a' },
    right: { type: 'string', value: 'b' },
  }
}];

function format(text: string) {
  return text.split('\n')
    .map(l => l.trim())
    .filter(l => l)
    .join('\n');
}

function insertRandomLineNumbers(ast, parent = null) {
  return ast.map(line => {
    const lineNo = Math.random();

    const newLine = {
      ...line,
      number: lineNo,
      signature: parent 
        ? parent.signature.concat(lineNo)
        : [lineNo],
    };

    if (newLine.children) {
      newLine.children = insertRandomLineNumbers(newLine.children, newLine);
    }

    return newLine;
  });
}

function expectTranspile(ast, result) {
  expect(format(new Transpiler()
    .transpile(insertRandomLineNumbers(ast))
  )).toBe(format(result));
}

function expectTranspileInsideScript(ast, result) {
  expect(format(new Transpiler().transpile([{
    number: 0,
    signature: [0],
    command: 'script',
    parameters: [{ type: 'token', value: 'TestScript' }],
    children: insertRandomLineNumbers(ast),
  }]))).toBe(format(result));
}

function expectThrow(ast, error = SyntaxError) {
  expect(() => new Transpiler()
    .transpile(insertRandomLineNumbers(ast))
  ).toThrow(error);
}

describe(Transpiler, () => {
  describe('lock', () => {
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
    });

    test('lock adds release even to subscript blocks', () => {
      expectTranspileInsideScript([{
        command: 'lock',
        children: [{
          command: 'if',
          parameters: IF_PARAMS_STUB,
          children: [{ command: 'hello' }],
        }],
      }], `
        TestScript::
          lock
          compare "a", "b"
          goto_if_eq _TestScript_Subscript_Code_0
          release
          end

        _TestScript_Subscript_Code_0::
          hello
          release
          end
      `);
    });

    test('lock does not add release to unrelated subscripts', () => {
      expectTranspileInsideScript([
        {
          command: 'if',
          parameters: IF_PARAMS_STUB,
          children: [{ command: 'hello' }],
        },
        {
          command: 'lock',
          children: [{ command: 'hello2' }],
        },
        {
          command: 'if',
          parameters: IF_PARAMS_STUB,
          children: [{ command: 'hello3' }],
        }
      ], `
        TestScript::
          compare "a", "b"
          goto_if_eq _TestScript_Subscript_Code_0
          lock
          hello2
          release
          compare "a", "b"
          goto_if_eq _TestScript_Subscript_Code_1
          end

        _TestScript_Subscript_Code_0::
          hello
          end
          
        _TestScript_Subscript_Code_1::
          hello3
          end
      `)
    });
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

  describe('conditionals', () => {
    test('basic if', () => {
      expectTranspileInsideScript([{
        command: 'if',
        parameters: [{ type: 'eq', value: {
          left: { type: 'string', value: 'a' },
          right: { type: 'string', value: 'b' },
        } }],
        children: [{ command: 'hello' }],
      }], `
        TestScript::
          compare "a", "b"
          goto_if_eq _TestScript_Subscript_Code_0
          end

        _TestScript_Subscript_Code_0::
          hello
          end
      `);
    });

    test('the inside of if subscripts are still parsed', () => {
      expectTranspileInsideScript([{
        command: 'if',
        parameters: [{ type: 'eq', value: {
          left: { type: 'string', value: 'a' },
          right: { type: 'string', value: 'b' },
        } }],
        children: [{
          command: 'lock',
          children: [{ command: 'hello' }],
        }],
      }], `
        TestScript::
          compare "a", "b"
          goto_if_eq _TestScript_Subscript_Code_0
          end

        _TestScript_Subscript_Code_0::
          lock
          hello
          release
          end
      `);
    });

    test('if else if', () => {
      expectTranspileInsideScript([
        {
          command: 'if',
          parameters: [{ type: 'eq', value: {
            left: { type: 'string', value: 'a' },
            right: { type: 'string', value: 'b' },
          } }],
          children: [{
            command: 'lock',
            children: [{ command: 'hello' }],
          }],
        },
        {
          command: 'else_if',
          parameters: [{
            type: 'eq', value: {
              left: { type: 'string', value: 'a' },
              right: { type: 'string', value: 'c' },
            }
          }],
          children: [{
            command: 'lock',
            children: [{ command: 'goodbye' }],
          }],
        },
        {
          command: 'else',
          children: [{
            command: 'lol',
          }],
        },
      ], `
        TestScript::
          compare "a", "b"
          goto_if_eq _TestScript_Subscript_Code_0
          compare "a", "c"
          goto_if_eq _TestScript_Subscript_Code_1
          lol
          end

        _TestScript_Subscript_Code_0::
          lock
          hello
          release
          end

        _TestScript_Subscript_Code_1::
          lock
          goodbye
          release
          end
      `);
    });
  });

  describe('say', () => {
    test('basic say', () => {
      expectTranspileInsideScript([{
        command: 'say',
        parameters: [{ type: 'string', value: 'asm' }],
      }], `
        TestScript::
          msgbox _TestScript_Subscript_Text_0, MSGBOX_DEFAULT
          end
          
        _TestScript_Subscript_Text_0:
          .string "asm"
      `);
    });

    test('a nonstandard msgbox', () => {
      expectTranspileInsideScript([{
        command: 'say',
        parameters: [
          { type: 'string', value: 'asm' },
          { type: 'constant', value: 'MSGBOX_SIGN' },
        ],
      }], `
        TestScript::
          msgbox _TestScript_Subscript_Text_0, MSGBOX_SIGN
          end
          
        _TestScript_Subscript_Text_0:
          .string "asm"
      `);
    });

    test('integrating using_msgbox', () => {
      expectTranspileInsideScript([{
        command: 'using_msgbox',
        parameters: [{ type: 'constant', value: 'MSGBOX_SIGN' }],
        children: [{
          command: 'say',
          parameters: [{ type: 'string', value: 'asm' }],
        }],
      }], `
        TestScript::
          msgbox _TestScript_Subscript_Text_0, MSGBOX_SIGN
          end
          
        _TestScript_Subscript_Text_0:
          .string "asm"
      `);
    });
  });

  describe('end', () => {
    test('end', () => {
      expectThrow([{ command: 'end' }]);
    });
  })
});