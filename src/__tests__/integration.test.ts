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

  test('two scripts', () => {
    expectDragonsbreath(`
      script ScriptX
        say_hello

      script ScriptY
        say_goodbye
    `, `
      ScriptX::
        say_hello
        end

      ScriptY::
        say_goodbye
        end
    `);
  });

  test('a friendly sign', () => {
    expectDragonsbreath(`
      script AFriendlySign
        using_msgbox MSGBOX_SIGN
          say "Hello!\\n"
          say "I am a sign.\\p"
          say "Anyways, go north.$"
    `, `
      AFriendlySign::
        msgbox _AFriendlySign_Subscript_Text_0, MSGBOX_SIGN
        end

      _AFriendlySign_Subscript_Text_0:
        .string "Hello!\\n"
        .string "I am a sign.\\p"
        .string "Anyways, go north.$"
    `);
  });

  test('gnosis fat man', () => {
    expectDragonsbreath(`
      script YamakiTown_FatMan
        lock
          faceplayer
          say "Did you know?$", MSGBOX_YESNO
          if it is 1
            say "What? I hadn't even told you yet!$"
          else
            choose_randomly
              option
                say "They said {COLOR CHARACTER_COLOR}Lord Jinhai{COLOR NO_COLOR} of the {COLOR CHARACTER_COLOR}Elite\\n"
                say "Dynasty{COLOR NO_COLOR} built a robotic Pokémon!\\p"
                say "How insane is that?! I love science!$"
              option
                say "I don't feel like talking right now...$"
    `, `
      YamakiTown_FatMan::
        lock
        faceplayer
        msgbox _YamakiTown_FatMan_Subscript_Text_0, MSGBOX_YESNO
        compare VAR_RESULT, 1
        goto_if_eq _YamakiTown_FatMan_Subscript_Code_2
        random 2
        switch VAR_RESULT
        case 0, _YamakiTown_FatMan_Subscript_Code_4
        case 1, _YamakiTown_FatMan_Subscript_Code_6
        release
        end

      _YamakiTown_FatMan_Subscript_Text_0:
        .string "Did you know?$"

      _YamakiTown_FatMan_Subscript_Text_1:
        .string "What? I hadn't even told you yet!$"

      _YamakiTown_FatMan_Subscript_Code_2::
        msgbox _YamakiTown_FatMan_Subscript_Text_1, MSGBOX_DEFAULT
        release
        end

      _YamakiTown_FatMan_Subscript_Text_3:
        .string "They said {COLOR CHARACTER_COLOR}Lord Jinhai{COLOR NO_COLOR} of the {COLOR CHARACTER_COLOR}Elite\\n"
        .string "Dynasty{COLOR NO_COLOR} built a robotic Pokémon!\\p"
        .string "How insane is that?! I love science!$"

      _YamakiTown_FatMan_Subscript_Code_4::
        msgbox _YamakiTown_FatMan_Subscript_Text_3, MSGBOX_DEFAULT
        release
        end

      _YamakiTown_FatMan_Subscript_Text_5:
        .string "I don't feel like talking right now...$"

      _YamakiTown_FatMan_Subscript_Code_6::
        msgbox _YamakiTown_FatMan_Subscript_Text_5, MSGBOX_DEFAULT
        release
        end
    `);
  });
});
