import { SandpackPreview } from "@codesandbox/sandpack-react";
import React from "react";

export function Preview() {
  return (
    <SandpackPreview
      showOpenInCodeSandbox={false}
      showRefreshButton={false}
      style={{ height: "100vh", paddingTop: 48 }}
    />
  );
}
