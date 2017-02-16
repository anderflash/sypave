import * as fs        from "fs";
import * as chalk     from "chalk";
import * as path      from "path";
import { Project }    from "./project";

export class Sy {
  async newProject(name: string,
                   version: string,
                   description: string,
                   license: string,
                   author: string): Promise<Project> {
    let project = new Project(name, version, description, license, author);
    await project.generate(path.join(__dirname, "..", "templates"));
    return project;
  }
}