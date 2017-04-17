import * as path from "path";
import * as fs from "fs";
import * as ts from "typescript";



function watch(rootFileNames: string[], options: ts.CompilerOptions): void {
  const files: ts.MapLike<{version: number}> = {};

  // initialize the list of files
  rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 };
  });

  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: () => rootFileNames,
    getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName) => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }
      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: () => path.join(process.cwd(), "src"),
    getCompilationSettings: () => options,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
  };

  // Create the language service files
  const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

  rootFileNames.forEach(fileName => {
    emitFile(fileName);
  });

  function emitFile(fileName: string): void {
    let output = services.getEmitOutput(fileName);

    if (!output.emitSkipped) {
      console.log(`Emitting ${fileName}`);
    } else {
      console.log(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach(o => {
      fs.writeFileSync(o.name, o.text, "utf8");
    });
  }
  function logErrors(filename: string): void {
    let allDiagnostics = services.getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(filename))
      .concat(services.getSemanticDiagnostics(filename));

    allDiagnostics.forEach(diagnostic => {
      let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        console.log(`   Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
      } else {
        console.log(`   Error: ${message}`);
      }
    });
  }
}

const currentDirectoryFiles = fs.readdirSync(path.join(process.cwd(), "src")).filter(fileName => fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === ".ts");
watch(currentDirectoryFiles, { module: ts.ModuleKind.CommonJS, outDir: "dist" });