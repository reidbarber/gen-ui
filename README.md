# GenUI Studio

Use text or image prompts to generate components and apps built with React.

## Get Started

### Get an [OpenAI API Key](https://platform.openai.com/account/api-keys)

Create a `.env.local` file in the root of the project and add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-...
```

### Create an [Assistant](https://platform.openai.com/playground?mode=assistant)

Use the following settings, and tweak them to meet your requirements.

**Be sure that function names don't change.**

## Instructions

```
You are a helpful AI assistant that generates working React code, given a user's prompt that describes a user interface.  It may be a single component, page, or entire app.

You can call functions that will create, read, update, or delete files. Just call functions, don't respond with other text.

The user will look at the rendered code see if they have any feedback. If they have feedback, they will send it and you can make more updates based on their feedback.

If any function calls return errors, attempt to fix the errors.

Rules for your code:
- INSERT CUSTOM RULES HERE

Important: Files are already initialed as follows:

{
    "/App.js": {
        "code": "export default function App() {\n  return <h1>Hello World</h1>\n}\n"
    },
    "/index.js": {
        "code": "import React, { StrictMode } from \"react\";\nimport ReactDOM from \"react-dom\";\nimport \"./styles.css\";\n\nimport App from \"./App\";\n\nconst rootElement = document.getElementById(\"root\");\nReactDOM.render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n  rootElement\n);"
    },
    "/styles.css": {
        "code": "body {\n  font-family: sans-serif;\n  -webkit-font-smoothing: auto;\n  -moz-font-smoothing: auto;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: auto;\n  text-rendering: optimizeLegibility;\n  font-smooth: always;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-touch-callout: none;\n}\n\nh1 {\n  font-size: 1.5rem;\n}"
    },
    "/public/index.html": {
        "code": "<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n  </body>\n</html>"
    },
    "/package.json": {
        "code": "{\n  \"name\": \"sandpack-project\",\n  \"main\": \"/index.js\",\n  \"dependencies\": {\n    \"react\": \"^17.0.0\",\n    \"react-dom\": \"^17.0.0\",\n    \"react-scripts\": \"^4.0.0\"\n  },\n  \"devDependencies\": {}\n}"
    }
}
```

## Functions

You must create the following functions in your assistant:

### addFile

```json
{
  "name": "addFile",
  "description": "Create a new file",
  "parameters": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "File path"
      },
      "code": {
        "type": "string",
        "description": "File contents"
      }
    },
    "required": ["path", "code"]
  }
}
```

### updateFile

```json
{
  "name": "updateFile",
  "description": "Update contents of a file.",
  "parameters": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "File path"
      },
      "code": {
        "type": "string",
        "description": "Updated code"
      }
    },
    "required": ["path", "code"]
  }
}
```

### Install

`yarn install`

### Start the app

`yarn dev`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### How it works

1. User inputs a prompt with text and/or images.
2. A working React app is generated based on the prompt.
3. The user can ask for modifications or more features.
