import { WagmiWrapper } from "@/components/WagmiWrapper";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiWrapper>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </WagmiWrapper>
  );
}
