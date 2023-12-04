import React from "react";
import { defaultTheme, Provider, SSRProvider } from "@adobe/react-spectrum";
import Head from "next/head";
import {
  SandpackProvider,
  SandpackPreview,
  useActiveCode,
  SandpackLayout,
  SandpackStack,
  FileTabs,
  useSandpack,
} from "@codesandbox/sandpack-react";
import { getLanguageOfFile } from "../utils/utils";
import Editor from "@monaco-editor/react";
import { PromptBar } from "../components/PromptBar";

function MonacoEditor() {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  const language = getLanguageOfFile(sandpack.activeFile);

  return (
    <SandpackStack style={{ height: "100vh", margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8, background: "#1e1e1e" }}>
        <Editor
          width="100%"
          height="100%"
          language={language}
          theme="vs-dark"
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value || "")}
        />
      </div>
    </SandpackStack>
  );
}

export default function Home(): JSX.Element {
  return (
    <SSRProvider>
      <Head>
        <title>GenUI</title>
      </Head>
      <Provider theme={defaultTheme} locale="en-US">
        <SandpackProvider theme="dark" template="react">
          <SandpackLayout>
            <MonacoEditor />
            <SandpackPreview style={{ height: "100vh" }} />
          </SandpackLayout>
        </SandpackProvider>
        <PromptBar />
      </Provider>
    </SSRProvider>
  );
}
