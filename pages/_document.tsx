
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {

  render() {
    return (
        <Html>
            <Head>
                <link rel="shortcut icon" href="/static/favicon.ico"></link>
                <link rel="icon" type="image/png" href="/static/favicon_32.png" sizes="32x32"></link>
                <link rel="icon" type="image/png" href="/static/favicon_192.png" sizes="192x192"></link>
            </Head>
            <body>
                <Main />
            </body>
            <NextScript />
        </Html>
    );
  }
}

export default MyDocument