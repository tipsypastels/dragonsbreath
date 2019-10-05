import Script from './script';
import Lock from './lock';
import If from './if';
import Else from './else';
import UsingMsgbox from './using_msgbox';
import Say from './say';
import End from './end';
import GiveMon from './givemon';
import MiscMovementCommand from './misc_movement_command';
import Move from './move';
import MoveAndWait from './move_and_wait';
import { BUNDLING_KEY } from '../bundling_logic';
import ___Bundle___ from './___bundle___';
import LockAll from './lockall';

const BUILTIN_COMMAND_DICT = {
  script: Script,
  lock: Lock,
  lockall: LockAll,
  if: If,
  else_if: If, // fundamentally the same output
  elif: If,
  else: Else,
  using_msgbox: UsingMsgbox,
  say: Say,
  end: End,
  step_end: End,
  givemon: GiveMon,
  move: Move,
  move_and_wait: MoveAndWait,
  [BUNDLING_KEY]: ___Bundle___,
}

MiscMovementCommand.all
  .forEach(m => BUILTIN_COMMAND_DICT[m] = MiscMovementCommand);

export default BUILTIN_COMMAND_DICT;