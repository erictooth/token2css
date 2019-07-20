import * as fs from "fs";
import * as path from "path";

import getStdin from "get-stdin";
import * as YAML from "js-yaml";

import { token2css as parser } from "./parser";

export const token2css = parser;

export default async function main() {
    const argv = require("yargs")
        .scriptName("token2css")
        .usage("$0 [src] [options]", "Convert a token file to an output", function(yargs) {
            yargs.positional("src", {
                describe: "The source file to read as a path ro the file or via STDIN",
                coerce: path.resolve,
            });
        })
        .option("o", {
            alias: "output",
            coerce: path.resolve,
            describe: "Output file (default stdout)",
            type: "string",
            demandOption: false,
        })
        .option("f", {
            alias: "format",
            choices: ["less", "sass", "scss", "stylus"],
            default: "scss",
            describe: "Preprocessor variable format",
            type: "string",
            demandOption: false,
        })
        .version().argv;

    const processFile = function(file: string) {
        const parsed = (function() {
            try {
                return JSON.parse(file);
            } catch (json_err) {
                try {
                    return YAML.safeLoad(file);
                } catch (yaml_err) {
                    process.exitCode = 1;
                    throw new Error("Unable to parse the file as JSON or YAML");
                }
            }
        })();

        const output = parser({ format: argv.format })(parsed).join("\n") + "\n";

        argv.output ? fs.writeFileSync(argv.output, output) : fs.writeSync(1, output);
    };

    if (argv.src) {
        processFile(fs.readFileSync(argv.src, "utf-8"));
    } else {
        getStdin()
            .then(function(input) {
                if (!input) {
                    return;
                }

                processFile(input);
            })
            .catch(function(e) {
                console.error(e);
            });
    }
}
