import * as fs from "fs";
import * as path from "path";
import { readFile, writeFile, showCreated, showError } from "./io";
import { exec } from "child_process";

/**
 * @brief      Class for project.
 */
export class Project {
  private _name: string;
  private _version: string;
  private _description: string;
  private _license: string;
  private _author: string;

  /**
   * Creating a project.
   */
  constructor(name: string,
              version: string,
              description: string,
              license: string,
              author: string) {
    this._name = name;
    this._version = version;
    this._description = description;
    this._license = license;
    this._author = author;
  }

  // Getters
  get name(): string{return this._name; }
  get version(): string{return this._version; }
  get description(): string{return this._description; }
  get license(): string{return this._license; }
  get author(): string{return this._author; }

  /**
   * @brief      Get template, replace project variables and output to the target folder
   *
   * @param      source       The source
   * @param      destination  The destination
   * @param      filename     The filename
   *
   * @return     just a Promise
   */
  private async processFile(source: string, destination: string, filename: string): Promise<void> {
    return readFile(path.join(source, filename))
            .then(data => writeFile(path.join(destination, filename), data))
            .then(()   => showCreated(path.join(destination, filename)));
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

      process.chdir(this.name);

      // Get templates folder
      let templatesFolder: string = path.join(__dirname, "..", "templates");
      let srcFolder: string = "src";
      fs.mkdirSync(srcFolder);
      showCreated(srcFolder);

      let promises = [].concat.apply([], [
        ["app.module.ts", "app.component.ts"].map(filename => this.processFile(templatesFolder, srcFolder, filename)),
        this.processFile(templatesFolder, ".", "package.json").then(() => this.installPackages()),
      ]);

      return Promise.all(promises);
    } else {
      showError("The folder is not empty");
    }
  }
}