# Dragonsbreath

*(Note that this project is still in a very early stage. It should be usable, and early adopter feedback would be lovely)*

## Installation

Dragonsbreath is written in TypeScript and compiled to JavaScript. Make sure you have node installed on your system.
```bash
npm install -g dragonsbreath
cd your/project/directory
dragonsbreath
```

By default, Dragonsbreath will find all `.dbr` files in the `data` folder of your project and convert them into `.inc` files. If there are existing `.inc` files with the same names, it will try to cleanly merge them and keep all existing scripts. Please tell me if you experience any issues with this.

If you want to auto-run Dragonsbreath every time you build your hack you could probably add it to your Makefile but I don't know much about how Makefiles work so I haven't tried it yet. I'll look into this for 1.0.

## Reasoning

For a lot of reasons, I dislike scripting in Pokeemerald. The rigid and unintuitive syntax makes programming much more error-prone, as well as taking way longer than it should for a decent-sized script. Instead, I decided to make a simpler and more pleasant language for use in my hack [Pokemon Gnosis](https://github.com/tipsypastels/pokegnosis) and any others who want to use it. It comes with with a transpiler (compiler? not sure what the right term is) that converts it into pokeemerald's scripting language.

Dragonsbreath syntax is exceedingly simple. Wherever possible it attempts to be completely English-like.
```text
script MyScript
  lock
    faceplayer
    checkplayergender
    if it is FEMALE
      say "Hey sis!$"
    else
      say "Ugh, what do you want?$"
```

Output:

```text
MyScript::
  lock
  faceplayer
  checkplayergender
  compare VAR_RESULT, FEMALE
  goto_if_eq _MyScript_Subscript_Code_1
  msgbox _MyScript_Subscript_Text_2, MSGBOX_DEFAULT
  release
  end
_MyScript_Subscript_Text_0:
  .string "Hey sis!$"
_MyScript_Subscript_Code_1::
  msgbox _MyScript_Subscript_Text_0, MSGBOX_DEFAULT
  release
  end
_MyScript_Subscript_Text_2:
  .string "Ugh, what do you want?$"
```

(As this is highly WIP the exact language semantics may vary. Final output may be slightly different).

So, as you may have gleaned from that, some intended features of the language:
- Use significant whitespacing.
- No end keyword.
- Text output is inline. No need to have a seperate text script.
- Conditionals are inline.
- You can use a command like `checkplayergender` inside an if statement.
- Certain commands like `lock` have logical pairs - if you indent the commands following lock (referred to as "passing commands as children to `lock`"), it will automatically add the `release` after the commands passed.

## Documentation

See the [wiki](https://github.com/tipsypastels/dragonsbreath/wiki).
