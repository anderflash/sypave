var gulp = require('gulp');
var fs   = require('fs');
var path = require('path');
const shell = require('gulp-shell');

// Shortcuts
const p = gulp.parallel;
const s = gulp.series;

function cli(done){
  var input = 'bin/cli.js';
  var output = 'bin/sy';
  fs.writeFileSync(output, "#!/usr/bin/env node\n" + fs.readFileSync(input));
  fs.chmodSync(output, 0755);
}

function watch(){
  gulp.watch('bin/cli.js', cli);
}

exports.watch   = p(watch);
exports.default = p(watch, shell.task(['tsc -w']));
 


// #!/usr/bin/env node
// var rollup = require('rollup');
// var rts    = require('rollup-plugin-typescript');
// var rwatch = require('rollup-watch');
// var ts     = require('typescript');
// var minify = require('uglify-js').minify;
// var ruglify= require('rollup-plugin-uglify');
// var chalk  = require('chalk');
// var fs     = require('fs');
// var gulp   = require('gulp');
// var gts    = require('gulp-typescript');

// // Shortcuts
// const p = gulp.parallel;
// const s = gulp.series;

// // var cache;
// // 
// var tsProject = gts.createProject();

// process.title = 'Sypave';

// function scripts(){
//   var tsResult = gulp.src('src/**/*.ts').pipe(tsProject());
//   return s(tsResult, p(
//     tsResult.dts.pipe(gulp.dest('dist/definitions')),
//     tsResult.js.pipe(gulp.dest('dist'))));
// }


// // Creating bin folder if it doesn't exist
// if(!fs.existsSync('bin'))
//   fs.mkdirSync('bin');

// exports.scripts = scripts;
// exports.build   = p(scripts);
// exports.default = exports.build;