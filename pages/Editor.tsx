import { Sandpack } from "@codesandbox/sandpack-react";
import React from "react";

const indexFile = `import React from "react";
import { createRoot } from "react-dom/client";
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import App from "./App";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <Provider theme={defaultTheme}>
    <App />
  </Provider>
);
`;

const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React Spectrum Example</title>
  </head>
  <body>
      <style>
        body {
          min-height: 100vh;
          margin: 0;
        }
        #app {
          min-height: 100vh;
        }
        #app > div {
          min-height: calc(100vh);
        }
      </style>
    <div id="app"></div>
  </body>
</html>`;

let defaultCode = `import {Flex, Heading, Content} from '@adobe/react-spectrum'
import NoSearchResults from '@spectrum-icons/illustrations/NoSearchResults';

export default function App() {
  return(
    <Flex direction="column" justifyContent="center" alignItems="center" height="100vh">
      <Heading>Live Preview</Heading>
      <Content>To get started, describe your app in the prompt.</Content>
    </Flex>
  );
}`;

let loadingCode = `import {ProgressCircle, Flex} from '@adobe/react-spectrum'

export default function App() {
  return(
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <ProgressCircle aria-label="Loading…" isIndeterminate />
    </Flex>
  );
}`;

export function Editor({ code, isLoading = false }): JSX.Element {
  return (
    <Sandpack
      theme="dark"
      files={{
        "/App.js": {
          code: isLoading ? loadingCode : code || defaultCode,
          active: true,
        },
        "/index.js": {
          code: indexFile,
          hidden: true,
        },
        "/index.html": {
          code: indexHtml,
          hidden: true,
        },
      }}
      customSetup={{
        dependencies: {
          "@adobe/react-spectrum": "latest",
          "@spectrum-icons/illustrations": "latest",
          react: "^18.0.0",
          "react-dom": "^18.0.0",
        },
        entry: "/index.js",
        environment: "create-react-app",
      }}
    />
  );
}
