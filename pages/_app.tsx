import { AssistantProvider } from "../context/AssistantContext";
import { ColorSchemeProvider } from "../context/ColorSchemeContext";
import { ModelsProvider } from "../context/ModelsContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ToastContainer } from "@react-spectrum/toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ColorSchemeProvider>
        <ModelsProvider>
          <AssistantProvider>
            <Component {...pageProps} />
          </AssistantProvider>
        </ModelsProvider>
      </ColorSchemeProvider>
      <ToastContainer />
    </>
  );
}
