"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prompt = require("prompt");
const sy_1 = require("../lib/sy");
function getHelp() {
    return `Usage: sy [command] [options]
    - sy new [name]: creates a new project
    - sy generate [type] [name]: create a component, service, class or interface
  `;
}
// Help text if not provided any argument
if (process.argv.length <= 2) {
    console.log(getHelp());
    process.exit(1);
}
// Start a new Sy instance
let sy = new sy_1.Sy();
process.on("SIGINT", function () {
    console.log("Caught interrupt signal");
    process.exit();
});
// Run correct process
switch (process.argv[2]) {
    case "new":
        if (process.argv.length <= 3) {
            console.error("Usage: sy new [name]");
            process.exit(1);
        }
        // Ask for some project info
        prompt.message = "";
        prompt.delimiter = "";
        prompt.get(["author's name"], (err, result) => {
            sy.newProject(process.argv[3], "0.0.1", "Sypave project", "MIT", result["author's name"]);
        });
        break;
    case "init":
        if (process.argv.length <= 3) {
            console.error("Usage: sy init [name]");
            process.exit(1);
        }
        break;
    case "generate":
        break;
    case "build":
        break;
    case "serve":
        break;
    default:
        console.log(getHelp());
        process.exit(1);
        break;
} //
