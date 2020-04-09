const tailwindcss = require("tailwindcss");

module.exports = {
  plugins: [
    tailwindcss("./tailwind.config.js"),
    ...(process.env.NODE_ENV === `production`
      ? [
          require("@fullhuman/postcss-purgecss")({
            content: [
              "./pages/**/*.jsx",
              "./pages/**/*.tsx",
              "./components/**/*.tsx"
            ],
            defaultExtractor: content =>
              content.match(/[A-Za-z0-9-_:/]+/g) || []
          }),
          require("autoprefixer"),
          require("cssnano")
        ]
      : [])
  ]
};
