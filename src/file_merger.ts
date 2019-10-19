import { DRAGONSBREATH_SCRIPT_MAGIC_COMMENT } from "./builtin_commands/script";

export default class FileMerger {
  constructor(
    private existingScripts: string,
    private newScripts: string,
  ) {}

  merge() {
    const existingScripts = this.extractScriptsToObj(this.existingScripts);
    const newScripts = this.extractScriptsToObj(this.newScripts);

    let all = { ...existingScripts, ...newScripts };

    // remove old dragonsbreath scripts that were removed in the incoming code
    for (let scriptName in all) {
      if (all[scriptName].includes(`@ ${DRAGONSBREATH_SCRIPT_MAGIC_COMMENT}`) && !newScripts[scriptName]) {
        delete all[scriptName];
      }
    }

    const finalScript = Object.entries(all).map(([title, body]) => {
      return title + body;
    }).join('\n');
    
    return finalScript;
  }

  private extractScriptsToObj(scripts: string): { [key: string]: string } {
    const results = {};
    const titlesAndBodies = scripts.split(/^\s*([A-z0-9_]+::?)/m)
      .slice(1);

    for (let i = 1; i < titlesAndBodies.length; i += 2) {
      results[titlesAndBodies[i - 1]] = titlesAndBodies[i];    
    }

    return results;
  }
}
