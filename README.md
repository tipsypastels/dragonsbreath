# Dragonsbreath

*(Note that this project is not yet ready for use. Contributions welcome~)*

For a lot of reasons, I dislike scripting in Pokeemerald. The rigid and unintuitive syntax makes programming much more error-prone, as well as taking longer. I dreaded making such scripts for my hack [Pokémon Gnosis](https://github.com/tipsypastels/pokegnosis), which includes many large cutscenes and events. Instead, I decided to make a simpler and more pleasant language, along with a transpiler (compiler? not sure what the right term is) that converts it into pokeemerald's scripting language.

Dragonsbreath syntax is exceedingly simple. Wherever possible it attempts to be completely English-like.
```text
script MyScript
  lock
    faceplayer
    if checkplayergender is FEMALE
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
  goto_if_eq MyScript__Subscript_1
  msgbox MyScript__Text_2, MSGBOX_DEFAULT
  release
  end

MyScript__Subscript_1::
  msgbox MyScript__Subscript_2, MSGBOX_DEFAULT
  end

MyScript__Text_1:
  .string "Hey sis!$"

MyScript__Text_2:
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

## Running Tests

Run the tests with `yarn test`.