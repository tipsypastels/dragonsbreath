import parse, { parseExpression } from "../src/parser";
import { BUNDLING_KEY } from "../src/bundling_logic";

function expectParse(code, match) {
  return expect(parse(code)).toStrictEqual(match);
}

function expectExpr(code, match) {
  return expect(parseExpression(code)).toStrictEqual(match);
}

describe(parse, () => {
  describe('syntax', () => {
    test('a single command', () => {
      expectParse('x 1', [{
        type: 'command',
        command: 'x',
        parameters: [{ type: 'number', value: 1 }],
      }]);
    });
  
    test('two commands on the same indent', () => {
      expectParse("x 1\ny 2", [
        {
          type: 'command',
          command: 'x',
          parameters: [{ type: 'number', value: 1 }],
        },
        {
          type: 'command',
          command: 'y',
          parameters: [{ type: 'number', value: 2 }],
        },
      ]);
    });

    test('one level of nesting', () => {
      expectParse("x 1\n  y 2", [{
        type: 'command',
        command: 'x',
        parameters: [{ type: 'number', value: 1 }],
        children: [{
          type: 'command',
          command: 'y',
          parameters: [{ type: 'number', value: 2 }],
        }],
      }]);
    });
  
    test('two levels of nesting', () => {
      expectParse("a\n  b\n    c", [{
        type: 'command',
        command: 'a',
        children: [{
          type: 'command',
          command: 'b',
          children: [{ type: 'command', command: 'c' }],
        }],
      }]);
    });
  
    test('two levels of nesting, jumping back and forth between levels', () => {
      expectParse("a\n  b\n    c\n  b2", [{
        type: 'command',
        command: 'a',
        children: [
          {
            type: 'command',
            command: 'b',
            children: [{ type: 'command', command: 'c' }],
          },
          { type: 'command', command: 'b2' },
        ],
      }]);
    });
  });

  describe('parameters', () => {
    test('a command with multiple parameters', () => {
      expectParse('x 1, 2, 3', [{
        type: 'command',
        command: 'x',
        parameters: [
          { type: 'number', value: 1 },
          { type: 'number', value: 2 },
          { type: 'number', value: 3 },
        ],
      }]);
    });

    test('strings with commas should not be splitters', () => {
      expectParse('x 1, 2, "a, b"', [{
        type: 'command',
        command: 'x',
        parameters: [
          { type: 'number', value: 1 },
          { type: 'number', value: 2 },
          { type: 'string', value: 'a, b' }, 
        ],
      }]);
    });
  });

  describe('bundling commands', () => {
    test('bundling two say calls', () => {
      expectParse('say "a"\nsay "b"', [{
        type: 'bundle',
        command: BUNDLING_KEY,
        bundlingGroup: 0,
        children: [
          {
            type: 'command',
            command: 'say',
            parameters: [{ type: 'string', value: 'a' }],
          },
          {
            type: 'command',
            command: 'say',
            parameters: [{ type: 'string', value: 'b' }],
          },
        ],
      }]);
    });

    test('bundling three say calls', () => {
      expectParse('say "a"\nsay "b"\nsay "c"', [{
        type: 'bundle',
        command: BUNDLING_KEY,
        bundlingGroup: 0,
        children: [
          {
            type: 'command',
            command: 'say',
            parameters: [{ type: 'string', value: 'a' }],
          },
          {
            type: 'command',
            command: 'say',
            parameters: [{ type: 'string', value: 'b' }],
          },
          {
            type: 'command',
            command: 'say',
            parameters: [{ type: 'string', value: 'c', }],
          },
        ],
      }]);
    });

    test('does not bundle across indent changes', () => {
      expectParse('say "a"\n  say "b"', [{
        type: 'command',
        command: 'say',
        parameters: [{ type: 'string', value: 'a' }],
        children: [{
          type: 'command',
          command: 'say',
          parameters: [{ type: 'string', value: 'b' }],
        }],
      }]);
    });

    test('bundling two commands from the same group', () => {
      expectParse('emote_heart\nstep_end', [{
        type: 'bundle',
        command: BUNDLING_KEY,
        bundlingGroup: 1,
        children: [
          {
            type: 'command',
            command: 'emote_heart',
          },
          {
            type: 'command',
            command: 'step_end',
          },
        ],
      }]);
    });
  });
});

describe(parseExpression, () => {
  test('it', () => {
    expectExpr('it', { type: 'it', value: 'it' });
  });

  test('a string', () => {
    expectExpr('"hello, world"', { type: 'string', value: 'hello, world' });
  });

  test('a number', () => {
    expectExpr('1', { type: 'number', value: 1 });
  });

  test('a multi-digit number', () => {
    expectExpr('23', { type: 'number', value: 23 });
  });

  test('a number with a decimal', () => {
    expectExpr('2.3', { type: 'number', value: 2.3 });
  });

  test('a number with a leading decimal', () => {
    expectExpr('.3', { type: 'number', value: 0.3 });
  });

  test('a number with a trailing decimal', () => {
    expectExpr('2.', { type: 'number', value: 2 });
  });

  test('a constant', () => {
    expectExpr('HELLO_WORLD', { type: 'constant', value: 'HELLO_WORLD'});
  });

  test('a constant with an x', () => {
    expectExpr('VAR_0x400', { type: 'constant', value: 'VAR_0x400' });
  });

  test('a token', () => {
    expectExpr('hello', { type: 'token', value: 'hello' })
  });

  test('equality', () => {
    expectExpr('a == b', {
      type: 'eq',
      left: { type: 'token', value: 'a' },
      right: { type: 'token', value: 'b' },
    });
  });
});