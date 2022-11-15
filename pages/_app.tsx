import { SessionProvider } from "next-auth/react"
import "./styles.css"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <WagmiConfig client={client}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </WagmiConfig>
  )
}
