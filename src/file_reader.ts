import fs from 'fs';

type FileCallback = (file: string, content: string) => void;

export default class FileReader {
  EXT = 'dbr';
  BASE = __dirname.replace(/\\(?:src|lib)$/, '')

  compileAll(callback?: FileCallback) {
    return this.compileDir(this.BASE, callback);
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