import * as fs from "node:fs";
import closureCompiler from 'google-closure-compiler';
const { compiler } = closureCompiler;

if (process.argv.length < 4){
    console.log(`Expected argument format is \n ${process.argv[0]} ${process.argv[1]} Input-File Output-File`);
    process.exit();
}
console.log("Converting to : " + process.argv[3])
const cc = new compiler({
    js: process.argv[2],
    language_in: 'UNSTABLE',
    compilation_level : 'SIMPLE'
});

// google-closure-compiler --language_in UNSTABLE --js show_videos_list_api.js --js_output_file show_videos_list_api.out.js
// https://github.com/google/closure-compiler
// https://closure-compiler.appspot.com/home
const compilerProcess = cc.run((exitCode, stdOut, stdErr) => {
    let out = stdOut.toString();
    if (exitCode != 0){
        console.log(stdErr.toString())
    }else{
        out = "javascript:" + encodeURIComponent(out.replaceAll(/[ \r\n]+/g, " "));
        fs.writeFile(process.argv[3], out, (err) => {
            if (err) throw err;
            else console.log("Completed")
        });
    }
});