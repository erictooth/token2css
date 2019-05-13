module.exports = function({ format }) {
  const formatVariable = (key, value) => {
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

  const toString = (token, prop) => {
    let tokens = [];

    if (typeof prop === "string" || typeof prop === "number") {
      if (typeof prop === "number") {
        prop = prop + "";
      }

      tokens.push(formatVariable(token, prop));
    } else if (typeof prop === "object") {
      tokens = tokens.concat(
        [].concat(
          ...Object.entries(prop).map(([key, value]) => {
            if (typeof vlaue === "number") {
              value = value + "";
            }

            const prevStr = token ? `${token}--` : "";
            return toString(`${prevStr}${key}`, value);
          })
        )
      );
    }

    return tokens;
  };

  return function(parsed) {
    return toString("", parsed);
  };
};
