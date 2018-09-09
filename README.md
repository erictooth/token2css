# token2css &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/erictooth/token2css/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/token2css.svg)](https://www.npmjs.com/package/token2css)

token2css takes a list of design tokens in a structured format such as JSON or YAML and converts them to a list of CSS preprocessor variables ([Less](http://lesscss.org), [Sass/SCSS](http://sass-lang.com), and [Stylus](http://stylus-lang.com) currently supported).

## Usage

With stdin/stdout

```bash
cat ./tokens.yaml | npx token2css -f stylus > output.styl
```

With input/output flags

```bash
npx token2css -i ./tokens.json -f scss -o output.scss
```

## Example

Design tokens:

```yaml
color:
  blue:
    25: "#000d80"
    50: "#001aff"
    100: "#f5fafe"
  grey:
    35: "#595959"
    50: "#787878"
    85: "#dddddd"
button:
  border-radius: 5px
  min-width: 60px
  padding: 7px 12px
  variant:
    primary:
      background-color: $color--blue--50
      border: 1px solid $color--blue--25
      color: white
```

SCSS output:

```scss
$color--blue--25: #000d80;
$color--blue--50: #001aff;
$color--blue--100: #f5fafe;
$color--grey--35: #595959;
$color--grey--50: #787878;
$color--grey--85: #dddddd;
$button--border-radius: 5px;
$button--min-width: 60px;
$button--padding: 7px 12px;
$button--variant--primary--background-color: $color--blue--50;
$button--variant--primary--border: 1px solid $color--blue--25;
$button--variant--primary--color: white;
```

## Token Guidelines

- Do not use arrays in your token file — named keys are required for each nested property (accomplished by using objects).

Wrong:

```yaml
color:
  - blue:
      25: "#000d80"
      50: "#001aff"
  - grey:
      35: "#595959"
      50: "#787878"
```

Correct:

```yaml
color:
  blue:
    25: "#000d80"
    50: "#001aff"
  grey:
    35: "#595959"
    50: "#787878"
```

- Each nested level of a token results in another `--` appended to the name.

Input:

```yaml
button:
    disabled:
        background-color: grey
```

Output:

```scss
$button--disabled-background-color: grey;
```

- If you want to reference a variable, always prepend the name with `$` — regardless of the target variable syntax you choose. `$` indicates that the following value is a variable and allows it to be reformatted for other languages.

```yaml
    color:
        blue:
            50: "#787878"
    button:
        background-color: $color--blue--50
```