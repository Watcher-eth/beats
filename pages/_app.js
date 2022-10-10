import { useEffect } from "react";
import client from "../lib/apolloClient.tsx";
import { useRouter } from "next/router";
import * as Fathom from "fathom-client";
import { ProfileProvider } from "../context/context";
import { MusicProvider } from "../context/MusicContext";
import { APP_NAME, CHAIN } from "../lib/consts.js";
import { ApolloProvider } from "@apollo/client";
import { createClient, WagmiConfig } from "wagmi";
import Layout from "../components/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { ConnectKitProvider, getDefaultClient } from "connectkit";
import { SpinampProvider } from "@spinamp/spinamp-hooks";
import PlayerState from '../context/AudioContext/PlayerState'
const alchemyId = "WxH_mAU0XciJz4PAFStdOYCvYTnXwTdz";
const wagmiClient = createClient(
  getDefaultClient({
    chains: [CHAIN],
    autoConnect: true,
    appName: APP_NAME,
    alchemyId,
  })
);

const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    Fathom.load("CVRODMKX", {
      includedDomains: ["lumiere.withlens.app"],
      url: "https://kangaroo-endorsed.withlens.app/script.js",
    });

    const onRouteChangeComplete = () => Fathom.trackPageview();

    router.events.on("routeChangeComplete", onRouteChangeComplete);

    return () => {
      router.events.off("routeChangeComplete", onRouteChangeComplete);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <ConnectKitProvider mode="light">
        <ApolloProvider client={client}>
          <SpinampProvider>
            <ChakraProvider>
              <ProfileProvider>
                <MusicProvider>
                  <PlayerState>
                  <AnimatePresence exitBeforeEnter>
                    <Layout>
                      <Component {...pageProps} />
                    </Layout>
                  </AnimatePresence>
                  </PlayerState>
                </MusicProvider>
              </ProfileProvider>
            </ChakraProvider>
          </SpinampProvider>
        </ApolloProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
};

export default App;
