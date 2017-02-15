import * as fs from 'fs';
import * as commander from 'commander';
import * as chalk from 'chalk';

export class Sy{
  constructor(){

  }
  newProject(name: string): void {
    if(!fs.existsSync(name)){
      fs.mkdirSync(name);
      console.log(chalk.green("create"), ` ${name}`);
    }
  }
}

