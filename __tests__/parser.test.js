const { parse, parseExpression } = require('../parser');

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
        command: 'x',
        parameters: [{ type: 'number', value: 1 }],
      }]);
    });
  
    test('two commands on the same indent', () => {
      expectParse("x 1\ny 2", [
        {
          command: 'x',
          parameters: [{ type: 'number', value: 1 }],
        },
        {
          command: 'y',
          parameters: [{ type: 'number', value: 2 }],
        },
      ]);
    });

    test('one level of nesting', () => {
      expectParse("x 1\n  y 2", [{
        command: 'x',
        parameters: [{ type: 'number', value: 1 }],
        children: [{
          command: 'y',
          parameters: [{ type: 'number', value: 2 }],
        }],
      }]);
    });
  
    test('two levels of nesting', () => {
      expectParse("a\n  b\n    c", [{
        command: 'a',
        children: [{
          command: 'b',
          children: [{ command: 'c' }],
        }],
      }]);
    });
  
    test('two levels of nesting, jumping back and forth between levels', () => {
      expectParse("a\n  b\n    c\n  b2", [{
        command: 'a',
        children: [
          {
            command: 'b',
            children: [{ command: 'c' }],
          },
          { command: 'b2' },
        ],
      }]);
    });
  });

  describe('parameters', () => {
    // test('a command with multiple parameters', () => {
    //   expectParse('x 1, 2, 3', [{
    //     command: 'x',
    //     parameters: [
    //       { type: 'number', value: 1 },
    //       { type: 'number', value: 2 },
    //       { type: 'number', value: 3 },
    //     ],
    //   }]);
    // });

    test('strings with commas should not be splitters', () => {
      expectParse('x 1, 2, "a, b"', [{
        command: 'x',
        parameters: [
          { type: 'number', value: 1 },
          { type: 'number', value: 2 },
          { type: 'string', value: 'a, b' }, 
        ],
      }]);
    });
  });
});

describe(parseExpression, () => {
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
      type: 'equality',
      left: { type: 'token', value: 'a' },
      right: { type: 'token', value: 'b' },
    });
  });
});