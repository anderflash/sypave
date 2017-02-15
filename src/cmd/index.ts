import * as chalk from 'chalk';
import { Sy } from '../sy';
import * as prompt from 'prompt';

function getHelp(): string{
  return `Usage: sy [command] [options]
    - sy new [name]: creates a new project
    - sy generate [type] [name]: create a component, service, class or interface
  `;
}

// Help text if not provided any argument
if(process.argv.length <= 2){
  console.log(getHelp());
  process.exit(1);
}

let sy = new Sy(); 

// Run correct process
switch(process.argv[2]){
  case 'new':
    if(process.argv.length <= 3){
      console.error('Usage: sy new [name]');
      process.exit(1);
    }
    // Ask for some project info
    prompt.get()
    sy.newProject(process.argv[3]);
  break;
  case 'init':
    if(process.argv.length <= 3){
      console.error('Usage: sy init [name]');
      process.exit(1);
    }
  break;
  case 'generate':
  break;
  case 'build':
  break;
  case 'serve':
  break;
  default:
    console.log(getHelp());
    process.exit(1);
  break;
}