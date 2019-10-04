import Script from './script';
import Lock from './lock';
import If from './if';

const BUILTIN_COMMAND_DICT = {
  script: Script,
  lock: Lock,
  if: If,
}

export default BUILTIN_COMMAND_DICT;