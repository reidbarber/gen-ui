import { SandboxEnvironment } from "@codesandbox/sandpack-react/types";

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
      <Heading>Get Started</Heading>
      <Content>Describe your app in the provided prompt.</Content>
    </Flex>
  );
}`;

const indexJs = `import React from "react";
import { createRoot } from "react-dom/client";
import { Provider, defaultTheme } from "@adobe/react-spectrum";
import App from "./App";

const container = document.getElementById("app");
console.log(document);
const root = createRoot(container);
root.render(
  <Provider theme={defaultTheme}>
    <App />
  </Provider>
);
`;


export const defaultFiles = {
    "/App.js": {
        "code": "import {Flex, Heading, Content} from '@adobe/react-spectrum'\n\nexport default function App() {\n  return (\n    <Flex direction=\"column\" justifyContent=\"center\" alignItems=\"center\" height=\"100vh\">\n      <Heading>Get Started</Heading>\n      <Content>Describe your app in the provided prompt.</Content>\n    </Flex>\n  );\n}\n"
    },
    "/index.js": {
        "code": "import React, { StrictMode } from \"react\";\nimport ReactDOM from \"react-dom\";\nimport { Provider, defaultTheme } from \"@adobe/react-spectrum\";\nimport \"./styles.css\";\n\nimport App from \"./App\";\n\nconst rootElement = document.getElementById(\"root\");\nReactDOM.render(\n  <StrictMode>\n    <Provider theme={defaultTheme}>\n      <App />\n    </Provider>\n  </StrictMode>,\n  rootElement\n);"
    },
    "/styles.css": {
        "code": "body {\n  min-height: 100vh;\n  margin: 0;\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}\n\n#root {\n  min-height: 100vh;\n}\n\n#root > div {\n  min-height: calc(100vh);\n}"
    },
    "/public/index.html": {
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>"
    },
    "/package.json": {
        "code": "{\n  \"name\": \"sandpack-project\",\n  \"main\": \"/index.js\",\n  \"dependencies\": {\n    \"react\": \"^17.0.0\",\n    \"react-dom\": \"^17.0.0\",\n    \"react-scripts\": \"^4.0.0\"\n  },\n  \"devDependencies\": {}\n}"
    }
};

export const defaultCustomSetup = {
  dependencies: {
    "@adobe/react-spectrum": "latest",
    "@spectrum-icons/illustrations": "latest",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
  },
  entry: "/index.js",
  environment: "create-react-app" as SandboxEnvironment,
};
