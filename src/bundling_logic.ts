import Line from "./line";
import { Chain } from "./parser";
import Say from "./builtin_commands/say";

export const BUNDLING_KEY = '___bundle___';

export const BUNDLING_GROUPS = [
  // text commands
  [
    'say', 'smart_say',
  ],
];

function getBundlingIndex(command: string): number {
  for (let i = 0; i < BUNDLING_GROUPS.length; i++) {
    if (BUNDLING_GROUPS[i].includes(command)) {
      return i;
    }
  }
  // return NaN so they don't compare equality, rather than having to also check against -1 or undefined
  return NaN;
}

function shouldBeBundled(lastLine: Line, currentLine: Line): boolean {
  if (!lastLine || !currentLine) {
    return false;
  }

  // this is already a bundle, check and then add it in
  if (lastLine.command === BUNDLING_KEY) {
    if (lastLine.bundlingGroup === getBundlingIndex(currentLine.command)) {
      return true;
    }
  // the last line is NOT currently a bundle
  } else {
    if (getBundlingIndex(lastLine.command) === getBundlingIndex(currentLine.command)) {
      if (lastLine.command === 'say' && currentLine.command === 'say') {
        // don't bundle different msgboxes together
        return getSayCommandMsgbox(lastLine) === getSayCommandMsgbox(currentLine);
      }

      return true;
    }
  }
  return false;
}

export function tryBundleLines(lastLine: Line, currentLine: Line): boolean {
  if (!shouldBeBundled(lastLine, currentLine)) {
    return false;
  }

  // if the last line is a bundle, add it on
  if (lastLine.command === BUNDLING_KEY) {
    lastLine.children.push(currentLine);
  } else {
    const lastLineDup = { ...lastLine };
    lastLine.bundlingGroup = getBundlingIndex(lastLine.command)
    lastLine.command = BUNDLING_KEY;
    lastLine.children = [lastLineDup, currentLine];
    delete lastLine.parameters;
  }

  return true;
}

function getSayCommandMsgbox(line: Line): string {
  if (line.command !== 'say') {
    throw new TypeError('must be used with the say command');
  }

  if (!line.parameters || !line.parameters[1]) {
    return undefined;
  }

  return line.parameters[1].value as string;
}