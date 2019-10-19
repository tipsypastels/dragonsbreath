import FileMerger from '../file_merger';
import { trimAndKeepIndents } from '../utils';
import Transpiler from '../transpiler';
import parse from '../parser';

function format(text: string) {
  return trimAndKeepIndents(text.split('\n')
    .filter(l => l.trim())
    .join('\n'));
}

function p(x) {
  console.log(x);
  return x;
}

// what is this pyramid of doom
function expectMerge(dragonsbreath: string) {
  return {
    into(existing: string) {
      return {
        toBe(output: string) {
          expect(
            format(
              new FileMerger(
                format(existing),
                new Transpiler().transpile(
                  parse(
                    format(dragonsbreath)
                  )
                ), 
              ).merge()
            ),
          )
          .toBe(format(output));
        }
      }
    }
  };
}

describe(FileMerger, () => {
  test('simple file merge', () => {
    expectMerge(`
      script HelloWorld
        hello_world
    `).into(`
      GoodBye::
        good_bye
        end
    `).toBe(`
      GoodBye::
        good_bye
        end

      HelloWorld:: @ Dbr-output
        hello_world
        end
    `);
  });

  test('removed dragonsbreath scripts are removed from the output', () => {
    expectMerge(`
      script MyNewScript
        something
    `).into(`
      A_Vanilla_Script::
        hello_world
        end

      Removed_Dbr_Script:: @ Dbr-output
        remove_me
        end
    `).toBe(`
      A_Vanilla_Script::
        hello_world
        end
        
      MyNewScript:: @ Dbr-output
        something
        end
    `);
  });
});