const css = require("css");

const remExp = /([.0-9]+[rem])\w+/g;

module.exports = function loader(content) {
  const parsed = css.parse(content);

  parsed.stylesheet.rules = parsed.stylesheet.rules.map(rule => {
    const declarations = rule.declarations || [];

    return {
      ...rule,
      declarations: declarations.map(declaration => {
        if (declaration.value && declaration.value.indexOf("rem") > -1) {
          let oldVal = declaration.value;
          const values = oldVal.match(remExp);
          values.forEach(value => {
            oldVal = oldVal.replace(value, `${parseFloat(value) * 16}px`);
          });
          return { ...declaration, value: oldVal };
        } else {
          return declaration;
        }
      })
    };
  });

  return css.stringify(parsed);
};
