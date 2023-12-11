import { Item, TabList, Tabs } from "@adobe/react-spectrum";
import { useSandpack } from "@codesandbox/sandpack-react";

export function FileTabs() {
  let { sandpack } = useSandpack();
  let files = sandpack.files;
  let activeFile = sandpack.activeFile;

  let fileNames = Object.entries(files).map(([path]) => ({
    path,
    label: path.split("/").pop(),
  }));

  return (
    <Tabs
      isQuiet
      selectedKey={activeFile}
      onSelectionChange={sandpack.setActiveFile}
      UNSAFE_style={{ zIndex: 5 }}
      aria-label="Files"
    >
      <TabList>
        {fileNames.map(({ path, label }) => (
          <Item key={path} title={label}>
            {label}
          </Item>
        ))}
      </TabList>
    </Tabs>
  );
}
