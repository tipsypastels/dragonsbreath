import parse from '../parser';
import Transpiler from '../transpiler';
import { trimAndKeepIndents } from '../utils';

function format(text: string) {
  return trimAndKeepIndents(text.split('\n')
    .filter(l => l.trim())
    .join('\n'));
}

function expectDragonsbreath(code, result) {
  expect(format(new Transpiler().transpile(parse(format(code)))))
    .toBe(format(result));
}

describe('integration tests', () => {
  test("avara's give dratini example script", () => {
    expectDragonsbreath(`
      script GivePokemonDemo
        lock
          faceplayer
          say "Please take this Dratini!$"
          getpartysize
          if it is 6
            say "Ah, your party is full.$"
          else
            givemon SPECIES_DRATINI, 5, ITEM_DRAGON_FANG, 0x0, 0x0, 0
            playfanfare MUS_FANA4
            say "{PLAYER} received a Dratini!$"
            waitfanfare
    `, `
      GivePokemonDemo::
        lock
        faceplayer
        msgbox _GivePokemonDemo_Subscript_Text_0, MSGBOX_DEFAULT
        getpartysize
        compare VAR_RESULT, 6
        goto_if_eq _GivePokemonDemo_Subscript_Code_2
        givemon SPECIES_DRATINI, 5, ITEM_DRAGON_FANG, 0x0, 0x0, 0
        playfanfare MUS_FANA4
        msgbox _GivePokemonDemo_Subscript_Text_3, MSGBOX_DEFAULT
        waitfanfare
        release
        end

      _GivePokemonDemo_Subscript_Text_0:
        .string "Please take this Dratini!$"

      _GivePokemonDemo_Subscript_Text_1:
        .string "Ah, your party is full.$"

      _GivePokemonDemo_Subscript_Code_2::
        msgbox _GivePokemonDemo_Subscript_Text_1, MSGBOX_DEFAULT
        release
        end

      _GivePokemonDemo_Subscript_Text_3:
        .string "{PLAYER} received a Dratini!$"
    `);
  });

  test('dancing the jig', () => {
    expectDragonsbreath(`
      script MyLittleDance
        lock
          faceplayer
          move 1
            walk_up
            walk_right
          faceplayer
          move 1
            walk_right
            walk_down
          faceplayer
          move 1
            walk_down
            walk_left
          faceplayer
          move 1
            walk_left
            walk_up
          faceplayer
          say "What do you think?$"
    `, `
      MyLittleDance::
        lock
        faceplayer
        applymovement 1, _MyLittleDance_Subscript_Movement_0
        faceplayer
        applymovement 1, _MyLittleDance_Subscript_Movement_1
        faceplayer
        applymovement 1, _MyLittleDance_Subscript_Movement_2
        faceplayer
        applymovement 1, _MyLittleDance_Subscript_Movement_3
        faceplayer
        msgbox _MyLittleDance_Subscript_Text_4, MSGBOX_DEFAULT
        release
        end

      _MyLittleDance_Subscript_Movement_0:
        walk_up
        walk_right
        step_end

      _MyLittleDance_Subscript_Movement_1:
        walk_right
        walk_down
        step_end

      _MyLittleDance_Subscript_Movement_2:
        walk_down
        walk_left
        step_end

      _MyLittleDance_Subscript_Movement_3:
        walk_left
        walk_up
        step_end

      _MyLittleDance_Subscript_Text_4:
        .string "What do you think?$"
    `);
  });
});