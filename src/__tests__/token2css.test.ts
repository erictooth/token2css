import * as fs from "fs";
import * as path from "path";
import * as YAML from "js-yaml";

import { token2css } from "../parser";

describe("token2css tests", function() {
    const file = YAML.safeLoad(fs.readFileSync(path.resolve(__dirname, "sample.yml"), "utf-8"));

    describe("basic API functionality", function() {
        it("should work with basic usage", function () {
            const func = token2css({ format: "scss" });

            expect(func).toBeInstanceOf(Function);
            expect(func(file)).toContain("$button--border-radius: 5px;");
        })

        it("should support stylus formatting", function () {
            const func = token2css({ format: "stylus" });

            expect(func).toBeInstanceOf(Function);
            expect(func(file)).toContain("button--border-radius = 5px;");
        });

        it("should support sass formatting", function () {
            const func = token2css({ format: "sass" });

            expect(func).toBeInstanceOf(Function);
            expect(func(file)).toContain("$button--border-radius: 5px");
        });

        it("should support less formatting", function () {
            const func = token2css({ format: "less" });

            expect(func).toBeInstanceOf(Function);
            expect(func(file)).toContain("@button--border-radius: 5px;");
        });
    });
});
