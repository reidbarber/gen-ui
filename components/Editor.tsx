import {
  SandpackStack,
  useActiveCode,
  useSandpack,
} from "@codesandbox/sandpack-react";
import React from "react";
import MonacoEditor from "@monaco-editor/react";
import { getLanguageOfFile } from "../utils/utils";
import { FileTabs } from "./FileTabs";

export function Editor({ colorScheme }) {
  const { code, updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  const language = getLanguageOfFile(sandpack.activeFile);

  return (
    <SandpackStack style={{ height: "100vh", margin: 0 }}>
      {/* <FileTabs className="z-[5]" style={{ border: "none" }} /> */}
      <FileTabs />
      <div className="flex-1 bg-gray-50">
        <MonacoEditor
          options={{
            minimap: {
              enabled: false,
            },
          }}
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
