# GenUI

Use text or image prompts to generate UI components and apps built with React. Powered by OpenAI's [Assistants API](https://platform.openai.com/docs/assistants/overview) and CodeSandbox's [Sandpack](https://sandpack.codesandbox.io/).

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

#### 1. Create a new assistant
- These can be generic (e.g. React), or specific to a component library (e.g. React Spectrum)
- These can be managed within GenUI, or on [OpenAI's Platform](https://platform.openai.com/assistants). Use OpenAI's platform to add files for [knowledge retrieval](https://platform.openai.com/docs/assistants/tools/knowledge-retrieval) (e.g. component library documentation in markdown files).
#### 2. Create a new thread with that assistant
- This represents the app that you're building, and all its iterations.
#### 3. Enter a text prompt and optionally add images.
- Note: Your OpenAI account must have access to the `gpt-vision-preview` model to upload images.
#### 5. A working React app is generated based on the prompt.
#### 6. Ask for modifications or more features to add to the app, and repeat.
