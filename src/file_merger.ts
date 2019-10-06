export default class FileMerger {
  constructor(
    private existingScripts: string,
    private newScripts: string,
  ) {}

  merge() {
    const all = { 
      ...this.extractScriptsToObj(this.existingScripts),
      ...this.extractScriptsToObj(this.newScripts),
    };

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
