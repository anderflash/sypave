import { Project } from "./project";

describe("Project unit tests", () => {
  it("should create a new project", (done) => {
    let name        = "project";
    let version     = "0.0.1";
    let description = "Cool project";
    let author      = "Anderson Tavares";
    let license     = "MIT";

    let project = new Project(name, version, description, license, author);
    expect(project).not.toBeNull();
    expect(project.name).toBe(name);
    expect(project.version).toBe(version);
    expect(project.description).toBe(description);
    expect(project.author).toBe(author);
    expect(project.license).toBe(license);
    done();
  });

  // it("should generate a file structure", (done) => {
  //   let project = new Project();
  //   project.generate("templates");
  // });
});