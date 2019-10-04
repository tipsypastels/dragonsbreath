import Script from './script';
import Lock from './lock';
import If from './if';
import Else from './else';
import UsingMsgbox from './using_msgbox';
import Say from './say';

const BUILTIN_COMMAND_DICT = {
  script: Script,
  lock: Lock,
  if: If,
  elseif: If, // fundamentally the same output
  else: Else,
  using_msgbox: UsingMsgbox,
  say: Say,
}

export default BUILTIN_COMMAND_DICT;