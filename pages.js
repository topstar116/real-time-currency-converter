const pages = {};

const chromeName = ["popup", "background", "options", "content", "test"];

chromeName.forEach((name) => {
  pages[name] = {
    entry: `src/pages/${name}/main.ts`,
    template: `src/pages/${name}/template.html`,
    filename: `${name}.html`,
  };
});

module.exports = pages;
