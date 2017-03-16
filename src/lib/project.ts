import * as fs from "fs";
import * as path from "path";
import { readFile, writeFile, showCreated, showError } from "./io";
import { exec } from "child_process";

/**
 * @brief      Class for project.
 */
export class Project {
  private _info: {name: string, version: string, description: string, license: string, author: string, componentCamel: string};

  /**
   * Creating a project.
   */
  constructor(name: string = "Project name",
              version: string = "0.0.0",
              description: string = "Sypave project",
              license: string = "MIT",
              author: string = "Someone") {
    this._info = {name: name, version: version, description: description, license: license, author: author, componentCamel: null};
  }

  // Getters
  get name(): string{return this._info.name; }
  get version(): string{return this._info.version; }
  get description(): string{return this._info.description; }
  get license(): string{return this._info.license; }
  get author(): string{return this._info.author; }

  /**
   * @brief      Get template, replace project variables and output to the target folder
   *
   * @param      source       The source
   * @param      destination  The destination
   * @param      filename     The filename
   *
   * @return     just a Promise
   */
  private async processFile(source: string, destination: string): Promise<void> {
    return readFile(source)
            .then(data => this.replaceAll(data, this._info))
            .then(data => writeFile(destination, data))
            .then(()   => showCreated(destination));
  }

  private replaceAll(str: string, mapObj: any): string {
    let re = new RegExp("{{(" + Object.keys(mapObj).join("|") + ")}}", "g");
    return str.replace(re, matched => mapObj[matched.slice(2, matched.length - 2)]);
  }

  /**
   * @brief      Install npm packages which are used by generated sypave projects
   *
   * @param      resolve  The resolve
   * @param      reject   The reject
   *
   * @return     { description_of_the_return_value }
   */
  private async installPackages(): Promise<any> {
    return new Promise((resolve, reject) => {
      let child = exec("npm i typescript@next @types/node --save-dev")
        .stderr.pipe(process.stderr)
        .on("exit", code => resolve(code))
        .on("error", err => reject(err));
    });
  }

  private async generateHTML(sourceFolder: string, destinationFolder: string, name: string): Promise<void> {
    return this.processFile(path.join(sourceFolder, "component.html"), path.join(destinationFolder, name + ".component.html"));
  }

  private async generateComponent(templatePath: string, destinationFolder: string, name: string, withFolder: boolean = true) {
    // convert to camel case
    this._info.componentCamel = name.replace(/(\-\w)/g, m => m[1].toUpperCase());
    return Promise.all([
      this.generateHTML(templatePath, destinationFolder, name),
      this.processFile(path.join(templatePath,))
      ;
    this.generate
  }

  /**
   * @brief      by using templates, create a project structure
   *
   * @param      templatesPath  The templates path
   *
   * @return     { description_of_the_return_value }
   */
  async generate(templatesPath: string): Promise<any> {
    // Create project folder
    if (!fs.existsSync(this.name)) {
      fs.mkdirSync(this.name);
      showCreated(this.name);

      // Go to this folder
      process.chdir(this.name);

      // Get templates folder
      let templatesFolder: string = path.join(__dirname, "..", "templates");
      let srcFolder: string = "src";
      fs.mkdirSync(srcFolder);
      showCreated(srcFolder);

      let promises = [].concat.apply([], [
        ["app.module.ts", "app.component.ts"].map(filename => this.processFile(path.join(templatesFolder, filename), path.join(srcFolder, filename))),
        this.generateHTML(templatesFolder, srcFolder, "app"),
        this.processFile(path.join(templatesFolder, "package.json"), path.join("package.json")).then(() => this.installPackages()),
      ]);

      return Promise.all(promises);
    } else {
      showError("The folder is not empty");
    }
  }
}