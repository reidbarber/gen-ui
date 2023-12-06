import { SandpackPreview } from "@codesandbox/sandpack-react";
import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";

export function Preview({ setColorScheme }) {
  // const { code, updateCode } = useActiveCode();
  // const { sandpack } = useSandpack();

  // Update preview's colorScheme when app's is switched
  // useEffect(() => {
  //   let indexFile = sandpack.files["/index.js"];
  //   if (
  //     indexFile &&
  //     indexFile.code.includes("<Provider") &&
  //     indexFile.code.includes("theme={")
  //   ) {
  //     let updatedIndexFile;
  //     if (indexFile.code.includes("colorScheme=")) {
  //       updatedIndexFile = indexFile.code.replace(
  //         /colorScheme=(["'])(.*?)\1/,
  //         `colorScheme="${colorScheme}"`
  //       );
  //     } else {
  //       updatedIndexFile = indexFile.code.replace(
  //         /<Provider/,
  //         `<Provider colorScheme="${colorScheme}"`
  //       );
  //     }
  //     sandpack.updateFile("/index.js", updatedIndexFile);
  //   }
  // }, [colorScheme]);

  return (
    <SandpackPreview style={{ height: "100vh" }}>
      <div className="absolute top-0 w-full bg-gray-100 h-500 py-50 px-200">
        <ThemeSwitcher setColorScheme={setColorScheme} />
      </div>
    </SandpackPreview>
  );
}
