import "../styles/globals.css";
import '../styles/sth1.css'
import "../styles/mainfont.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <title>천공의 섬 포스텍</title>
    <Component {...pageProps} />
  </>;
}

export default MyApp;
