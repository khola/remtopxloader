const css = require("css");

const remBasedValues = /([.0-9]+[rem])\w+/g;

module.exports = function loader(content) {
  const parsed = css.parse(content);

  parsed.stylesheet.rules = parsed.stylesheet.rules.map(rule => {
    const declarations = rule.declarations || [];

    return {
      ...rule,
      declarations: declarations.map(declaration => {
        if (declaration.value && declaration.value.indexOf("rem") > -1) {
          let currentValue = declaration.value;
          const values = currentValue.match(remBasedValues);
          values.forEach(value => {
            currentValue = currentValue.replace(value, `${parseFloat(value) * 16}px`);
          });
          return { ...declaration, value: currentValue };
        } else {
          return declaration;
        }
      })
    };
  });

  return css.stringify(parsed);
};
