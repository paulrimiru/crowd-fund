import { RemixBrowser } from "@remix-run/react";
import { hydrate } from "react-dom";
import type { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

hydrate(<RemixBrowser />, document);
