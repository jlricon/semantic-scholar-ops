import App from "next/app";
import * as Sentry from "@sentry/node";

Sentry.init({
  // Replace with your project's Sentry DSN
  dsn: `https://4a090e4850194046a0c4e7ead31c09a0@sentry.io/1839641`
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    // Workaround for https://github.com/zeit/next.js/issues/8592
    const { err } = this.props;
    const modifiedPageProps = { ...pageProps, err };

    return <Component {...modifiedPageProps} />;
  }
}

export default MyApp;
