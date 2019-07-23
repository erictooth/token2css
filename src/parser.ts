declare type Formats = "sass" | "scss" | "stylus" | "less";

/**
 * Normalizes values so they all behave as a strings. Numbers are
 * casted to string and other complex types have `.toString()` called.
 */
const normalizeValues = (value: string | number) => {
    if (typeof value === "number") {
        return value + "";
    }

    return value;
};

/**
 * Main entry point for API consumption.
 */
export function token2css({ format }: { format: Formats }) {
    const formatVariable = (key: string, value: string) => {
        switch (format) {
            case "stylus":
                return `${key} = ${value.replace("$", "")};`;
            case "sass":
                return `\$${key}: ${value}`;
            case "scss":
                return `\$${key}: ${value};`;
            case "less":
                return `@${key}: ${value.replace("$", "@")};`;
            default:
                throw new Error("Unknown variable format");
        }
    };

    const toString = (token: string, prop: string | number) => {
        let tokens: string[] = [];

        if (typeof prop === "string" || typeof prop === "number") {
            tokens.push(formatVariable(token, normalizeValues(prop)));
        } else if (typeof prop === "object") {
            tokens = tokens.concat(
                [].concat(
                    // @ts-ignore
                    ...Object.entries(prop).map(([key, value]: [string, string]) => {
                        const prevStr = token ? `${token}--` : "";

                        return toString(
                            `${prevStr}${key}`,
                            normalizeValues(value)
                        );
                    })
                )
            );
        }

        return tokens;
    };

    return function(parsed: string) {
        return toString("", parsed);
    };
};
