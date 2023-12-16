# GenUI

Use text or image prompts to generate UI components and apps built with React. Powered by OpenAI's [Assistant's API](https://platform.openai.com/docs/assistants/overview) and CodeSandbox's [Sandpack](https://sandpack.codesandbox.io/).

![Screenshot of GenUI Studio with a timeline panel on the left, code in the middle, rendered example on the right, and prompt bar overlayed on bottom. Example shows a signup form being built.](https://github.com/reidbarber/GenUI/assets/8961049/a5948a4a-56a2-46b2-bad0-1b38a4068c75)

## Get Started

### Get an [OpenAI API Key](https://platform.openai.com/account/api-keys)

Create a `.env.local` file in the root of the project and add your OpenAI API key:

```bash
OPENAI_API_KEY=sk-...
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
