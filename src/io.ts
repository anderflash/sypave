import * as fs        from "fs";
import * as chalk     from "chalk";

export function readFile(name: string, encoding: string = "utf8"): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(name, encoding, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}
export function writeFile(name: string, data: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(name, data, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function showError(message: string) {
  console.error(chalk.red("ERR!"), message);
}

export function showCreated(message: string) {
  console.log(chalk.green("created "), message);
}