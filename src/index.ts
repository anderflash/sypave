import * as commander from 'commander';
import { Sy } from './sy';

let sy = new Sy();

commander
  .version('0.0.1')
  .command("new [name]", "Creates a new project")
  .command("generate [type] [name]", "").alias('g')
  .command("build")
  .parse(process.argv);