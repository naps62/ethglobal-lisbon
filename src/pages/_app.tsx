import { WagmiWrapper } from "@/components/WagmiWrapper";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiWrapper>
      <Component {...pageProps} />
    </WagmiWrapper>
  );
}
