import Transpiler from "../transpiler";
import Line from "../line";

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

    test('lockall with no children', () => {
      expectTranspile([{
        command: 'lockall'
      }], `lockall`);
    });

    test('lockall with children', () => {
      expectTranspile([{
        command: 'lockall',
        children: [{ command: 'hello' }],
      }], `
        lockall
        hello
        releaseall
      `);
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

    test('manually setting the msgbox does not persist for subsequent says', () => {
      expectTranspileInsideScript([
        { 
          command: 'say',
          parameters: [
            { type: 'string', value: 'hello' },
            { type: 'constant', value: 'MSGBOX_SIGN' },
          ],
        }, 
        {
          command: 'say',
          parameters: [
            { type: 'string', value: 'goodbye' },
          ],
        },
      ], `
        TestScript::
          msgbox _TestScript_Subscript_Text_0, MSGBOX_SIGN
          msgbox _TestScript_Subscript_Text_1, MSGBOX_DEFAULT
          end

        _TestScript_Subscript_Text_0:
          .string "hello"

        _TestScript_Subscript_Text_1:
          .string "goodbye"
      `);
    });

    test('using_msgbox does not affect non-children', () => {
      expectTranspileInsideScript([
        {
          command: 'using_msgbox',
          parameters: [{ type: 'constant', value: 'MSGBOX_SIGN' }],
          children: [{
            command: 'say',
            parameters: [{ type: 'string', value: 'asm' }],
          }],
        },
        {
          command: 'say',
          parameters: [{ type: 'string', value: 'do not make this a sign' }],
        },
      ], `
        TestScript::
          msgbox _TestScript_Subscript_Text_0, MSGBOX_SIGN
          msgbox _TestScript_Subscript_Text_1, MSGBOX_DEFAULT
          end

        _TestScript_Subscript_Text_0:
          .string "asm"

        _TestScript_Subscript_Text_1:
          .string "do not make this a sign"
      `);
    });
  });

  describe('end', () => {
    test('end', () => {
      expectThrow([{ command: 'end' }]);
    });
  });

  describe('givemon', () => {
    test('with all parameters', () => {
      expectTranspile([{
        command: 'givemon',
        parameters: [
          { type: 'constant', value: 'PSYDUCK' },
          { type: 'number', value: 5 },
          { type: 'constant', value: 'ITEM_NONE' },
          { type: 'constant', value: '0x0' },
          { type: 'constant', value: '0x0' },
          { type: 'number', value: 0 },
        ]
      }], `givemon PSYDUCK, 5, ITEM_NONE, 0x0, 0x0, 0`);
    });

    test('with minimal parameters', () => {
      expectTranspile([{
        command: 'givemon',
        parameters: [
          { type: 'constant', value: 'PSYDUCK' },
          { type: 'number', value: 5 },
        ]
      }], `givemon PSYDUCK, 5, ITEM_NONE, 0x0, 0x0, 0`);
    });

    test('with partial parameters', () => {
      expectTranspile([{
        command: 'givemon',
        parameters: [
          { type: 'constant', value: 'PSYDUCK' },
          { type: 'number', value: 5 },
          { type: 'constant', value: 'ITEM_NONE' },
          { type: 'constant', value: '0x0' },
        ]
      }], `givemon PSYDUCK, 5, ITEM_NONE, 0x0, 0x0, 0`);
    });
  });

  describe('movement', () => {
    test('basic movement', () => {
      expectTranspileInsideScript([{
        command: 'move',
        parameters: [{ type: 'number', value: '1' }],
        children: [
          { command: 'walk_up' },
          { command: 'walk_down' }
        ]
      }], `
        TestScript::
          applymovement 1, _TestScript_Subscript_Movement_0
          end

        _TestScript_Subscript_Movement_0:
          walk_up
          walk_down
          step_end
      `);
    });

    test('moving the player', () => {
      expectTranspileInsideScript([{
        command: 'move',
        parameters: [{ type: 'token', value: 'player' }],
        children: [
          { command: 'walk_up' },
          { command: 'walk_down' }
        ]
      }], `
        TestScript::
          applymovement EVENT_OBJ_ID_PLAYER, _TestScript_Subscript_Movement_0
          end

        _TestScript_Subscript_Movement_0:
          walk_up
          walk_down
          step_end
      `);
    });

    test('cannot use movement commands outside of move', () => {
      expectThrow([{ command: 'walk_up' }]);
    });

    test('move_and_wait', () => {
      expectTranspileInsideScript([{
        command: 'move_and_wait',
        parameters: [{ type: 'token', value: 'player' }],
        children: [
          { command: 'walk_up' },
          { command: 'walk_down' }
        ]
      }], `
        TestScript::
          applymovement EVENT_OBJ_ID_PLAYER, _TestScript_Subscript_Movement_0
          waitmovement EVENT_OBJ_ID_PLAYER
          end

        _TestScript_Subscript_Movement_0:
          walk_up
          walk_down
          step_end
      `);
    });

    test('move does not permit regular commands as children', () => {
      expectThrow([{
        command: 'move',
        parameters: [{ type: 'token', value: 'player' }],
        children: [{
          command: 'lock'
        }],
      }]);
    });
  });

  describe('choose_randomly', () => {
    test('basic usage', () => {
      expectTranspileInsideScript([{
        command: 'choose_randomly',
        children: [
          {
            command: 'option',
            children: [{
              command: 'say',
              parameters: [{ type: 'string', value: 'option 1' }],
            }],
          },
          {
            command: 'option',
            children: [{
              command: 'say',
              parameters: [{ type: 'string', value: 'option 2' }],
            }],
          },
          {
            command: 'option',
            children: [{
              command: 'say',
              parameters: [{ type: 'string', value: 'option 3' }],
            }],
          },
        ],
      }], `
        TestScript::
          random 3
          switch VAR_RESULT
          case 0, _TestScript_Subscript_Code_1
          case 1, _TestScript_Subscript_Code_3
          case 2, _TestScript_Subscript_Code_5
          end

        _TestScript_Subscript_Text_0:
          .string "option 1"

        _TestScript_Subscript_Code_1::
          msgbox _TestScript_Subscript_Text_0, MSGBOX_DEFAULT
          end

        _TestScript_Subscript_Text_2:
          .string "option 2"

        _TestScript_Subscript_Code_3::
          msgbox _TestScript_Subscript_Text_2, MSGBOX_DEFAULT
          end
          
        _TestScript_Subscript_Text_4:
          .string "option 3"

        _TestScript_Subscript_Code_5::
          msgbox _TestScript_Subscript_Text_4, MSGBOX_DEFAULT
          end
      `);
    });

    test('cannot use choose_randomly with direct children', () => {
      expectThrow([{ command: 'choose_randomly', children: [{ command: 'hello' }] }]);
    });

    test('cannot use option outside of choose_randomly', () => {
      expectThrow([{ 
        command: 'script', 
        parameters: [{ type: 'token', name: 'X' }], 
        children: [{ command: 'option' }],
      }]);
    });
  });

  describe('return', () => {
    test('scripts dont add ends after returns', () => {
      expectTranspileInsideScript([{ command: 'return' }], `
        TestScript::
          return
      `);
    });

    test('subscripts dont add ends after returns', () => {
      expectTranspileInsideScript([{
        command: 'if',
        parameters: [{ type: 'eq', value: {
          left: { type: 'number', value: 1 },
          right: { type: 'number', value: 2 },
        } }],
        children: [{
          command: 'return'
        }],
      }], `
        TestScript::
          compare 1, 2
          goto_if_eq _TestScript_Subscript_Code_0
          end

        _TestScript_Subscript_Code_0::
          return
      `);
    });
  });
});