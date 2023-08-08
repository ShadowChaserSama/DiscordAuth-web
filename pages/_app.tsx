import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import HeaderComp from "./components/Header";

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <>
      <Head>
        <title>Discord Auth</title>
        <link
          rel='shortcut icon'
          href='/logo.png'
        />
        <meta
          name='viewport'
          content='minimum-scale=1, initial-scale=1, width=device-width'
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          primaryColor: "red",
          fontFamily: "Quicksands , sans-serif",
          colorScheme: "dark",
          focusRing: "never",
        }}>
        <SessionProvider session={session}>
          <HeaderComp></HeaderComp>
          <Component {...pageProps} />
        </SessionProvider>
      </MantineProvider>
    </>
  );
}
