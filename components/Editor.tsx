import {
  FileTabs,
  Sandpack,
  SandpackStack,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { getLanguageOfFile } from "../utils/utils";

export function Editor({ colorScheme }) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  const language = getLanguageOfFile(sandpack.activeFile);

  let updateFile = (file: string, code: string) => {
    sandpack.updateFile(file, code);
  };

  let files = sandpack.files;

  return (
    <SandpackStack style={{ height: "100vh", margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1, background: "#1e1e1e" }}>
        <MonacoEditor
          width="100%"
          height="100%"
          language={language}
          theme={colorScheme === "dark" ? "vs-dark" : "light"}
          key={sandpack.activeFile}
          defaultValue={code}
          onChange={(value) => updateCode(value || "")}
        />
      </div>
    </SandpackStack>
  );
}
