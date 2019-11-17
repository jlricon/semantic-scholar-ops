const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  devIndicators: {
    autoPrerender: false
  },
  env: {
    HOST_ADDR: process.env.HOST_ADDR
  }
});
