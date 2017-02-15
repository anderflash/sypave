"use strict";
console.log(process.argv);
function getHelp() {
    return "Usage: sy [command] [options]\n    - sy new [name]: creates a new project\n    - sy generate [type] [name]: create a component, service, class or interface\n  ";
}
if (process.argv.length <= 2) {
    console.log(getHelp());
}
