# Text2UI with React Spectrum

Use a text prompt to generate working UIs with React Spectrum components. Powered by OpenAI Codex.

<p align="center">
  <img width="545" alt="Screenshot of Text2UI, showing a prompt with a table with every US State and its population, along with the code returned by Text2UI and rendered" src="https://user-images.githubusercontent.com/8961049/206802886-34a97fe2-c453-4df3-b7b7-7fe23620de1d.png">
</p>

## Get Started

### Get an [OpenAI API Key](https://beta.openai.com/account/api-keys)

Note: Codex usage is [free](https://beta.openai.com/docs/models/codex) while in limited beta.

Create a `.env.local` file in the root of the project and add your OpenAI API key:

```bash
OPENAI_KEY=sk-...
```

### Install

`yarn install`

### Start the app

`yarn dev`

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### How it works

1. User inputs a prompt.
2. The app gets some examples to include in it's request to Codex. For example, if the prompt includes the word `table`, it will include examples of React Spectrum's TableView in it's prompt to help guide it to a better output.
3. The API returns it's best guess at what the user wants to build.

### Settings

The user can adjust some settings to try to get better results

- **Prompt** - Edit the prompt to get different results from Codex. `{{examples}}` and `{{prompt}}` will be replaced with the examples and prompt respectively before being sent to Codex.
- **Model** - The model to use. The default is `code-davinci-002` which is the most powerful model.
- **Temperature** - The higher the temperature, the more random the completions. This should usually stay at 0 or very low for code use cases.
- **Max tokens** - The maximum number of tokens to return. This can be increased if more code is expected in an output.
