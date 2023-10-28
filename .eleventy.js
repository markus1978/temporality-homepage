const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const htmlmin = require("html-minifier");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const svgContents = require("eleventy-plugin-svg-contents");
const sharp = require('sharp');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(svgContents);

  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
  });

  for (let ext of ["jpg", "jpeg"]) {
    eleventyConfig.addTemplateFormats(ext);
    eleventyConfig.addExtension(ext, {
      compile: async (inputContent, inputPath) => {
        let output = await sharp(inputPath).resize(1000).toBuffer();
        return async () => {
          return output;
        };
      },
      outputFileExtension: "jpg"
    });
  }

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  const md = require("markdown-it")({
    html: true,
    linkify: true,
    typographer: true,
  });

  eleventyConfig.addFilter("markdownify", (markdownString) =>
    md.render(markdownString)
  );

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    assthroughFileCopy: true,
    dir: {
      input: "src",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
  };
};
