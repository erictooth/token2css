const normalizePrimitives = value => {
  if (typeof value === "number") {
    return value + "";
  }

  return value;
};

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
      tokens.push(formatVariable(token, normalizePrimitives(prop)));
    } else if (typeof prop === "object") {
      tokens = tokens.concat(
        [].concat(
          ...Object.entries(prop).map(([key, value]) => {
            const prevStr = token ? `${token}--` : "";
            return toString(`${prevStr}${key}`, normalizePrimitives(value));
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
