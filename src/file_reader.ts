import fs from 'fs';

type FileCallback = (file: string, content: string) => void;

export default class FileReader {
  EXT = 'dbr';
  BASE = 'data';

  compileAll(callback?: FileCallback) {
    if (!fs.existsSync(this.BASE)) {
      console.log(`\x1b[31mThe path "${this.BASE}" could not be found in this directory.\x1b[0m`);
    } else {
      return this.compileDir(this.BASE, callback);
    }
  }

  private compileDir(dir: string, callback?: FileCallback): string[] {
    let results: string[] = [];
    const files = fs.readdirSync(dir) || [];

    for (const file of files) {
      const fullPath = dir + '/' + file;
      if (fs.statSync(fullPath).isDirectory()) {
        results = [...results, ...this.compileDir(fullPath, callback)];
      } else if (file.endsWith(`.${this.EXT}`)) {
        if (callback) {
          callback(fullPath, fs.readFileSync(fullPath, 'utf8'));
        }
        results = results.concat(fullPath);
      }
    }

    return results;
  }
}