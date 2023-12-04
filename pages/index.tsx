import React from "react";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import Head from "next/head";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { PromptBar } from "../components/PromptBar";
import { Editor } from "./Editor";
import { defaultCustomSetup, defaultFiles } from "../data/sandpack";

export default function Home(): JSX.Element {
  let [files, setFiles] = React.useState(defaultFiles);
  return (
    <Provider theme={defaultTheme} locale="en-US">
      <Head>
        <title>GenUI</title>
      </Head>
      <SandpackProvider
        files={files}
        customSetup={defaultCustomSetup}
        theme="dark"
        template="react"
      >
        <SandpackLayout>
          <Editor />
          <SandpackPreview style={{ height: "100vh" }} />
        </SandpackLayout>
      </SandpackProvider>
      <PromptBar />
    </Provider>
  );
}
