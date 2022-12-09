import React, { Key, useEffect, useState } from "react";
import {
  Grid,
  View,
  defaultTheme,
  Provider,
  Button,
  Text,
  TextField,
  ActionButton,
  DialogTrigger,
  Heading,
  Content,
  Dialog,
  Divider,
  ButtonGroup,
  Flex,
  Slider,
  NumberField,
  Item,
  DialogContainer,
  AlertDialog,
  SSRProvider,
  Picker,
  TextArea,
} from "@adobe/react-spectrum";
import MagicWand from "@spectrum-icons/workflow/MagicWand";
import Settings from "@spectrum-icons/workflow/Settings";
import { Editor } from "./Editor";
import { TemperatureInfo } from "./info/TemperatureInfo";
import { ModelInfo } from "./info/ModelInfo";
import { MaxTokensInfo } from "./info/MaxTokensInfo";
import examples from './examples.json';
import Head from "next/head";

const DEFAULT_PROMPT = `/*
  You're given a prompt and you need to return a React component that matches the prompt.
  Use React Spectrum components to build a React component called App, made with function components and hooks.
  Import components from the @adobe/react-spectrum package

  Here are some example descriptions with code samples:
    {{examples}}

  Your prompt is: {{prompt}}.
*/`;

const STOP_SEQUENCE = 'export default App;';

let getFullPrompt = (prompt: string, userInput: string) => {
  let components = Object.keys(examples).filter(componentName => userInput.includes(componentName));
  let examplesString = components.map((component) => `description: ${examples[component].description}\ncomponent: ${examples[component].example}\n\n`).join('\n');
  return prompt
    .replace('{{prompt}}', userInput)
    .replace('{{examples}}', examplesString);
};

export default function Home(): JSX.Element {
  let [userInput, setUserInput] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [code, setCode] = useState(null);
  let [alert, setAlert] = useState<null | string>(null);
  let [prompt, setPrompt] = useState(DEFAULT_PROMPT); 

  let [selectedModel, setSelectedModel] = useState<Key>("code-davinci-002");
  let [temperature, setTemperature] = useState(0);
  let [maxTokens, setMaxTokens] = useState(2048);
  let [models, setModels] = useState([])

  useEffect(() => {
    fetchModels();
  }, []);

  let fetchCompletion = async () => {
    setIsLoading(true);

    try {
      let res = await fetch(`api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: getFullPrompt(prompt, userInput),
          temperature,
          max_tokens: maxTokens,
          stop: STOP_SEQUENCE
        }),
      });
      let json = await res.json();
      if (json.error) {
        setAlert(json.error.message);
      } else {
        setCode(json.choices[0].text.trim().concat(`\n\n${STOP_SEQUENCE}`));
      }
    } catch (error) {
      setAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  let fetchModels = async () => {
    try {
      let res = await fetch(`api/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      let json = await res.json();
      if (json.error) {
        setAlert(json.error.message);
      } else {
        setModels(json.data);
      }
    } catch (error) {
      // TODO: check error message
      setAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  let handleGenerate = () => {
    if (userInput.trim() === '') {
      setAlert('Please provide a prompt');
    } else {
      fetchCompletion();
    }
  }

  return (
    <SSRProvider>
      <Provider theme={defaultTheme} locale="en-US">
        <Head>
          <title>Text2UI with React Spectrum</title>
        </Head>
        <header>
          <DialogTrigger>
            <ActionButton aria-label="Settings">
              <Settings />
            </ActionButton>
            {(close) => (
              <Dialog size="L">
                <Heading>Settings</Heading>
                <Divider />
                <Content>
                  <Flex direction="column">
                    <Flex marginTop="size-100" marginBottom="size-100">
                      <TextArea label="Prompt" value={prompt} onChange={setPrompt} width="100%" />
                    </Flex>
                    <Flex marginTop="size-100" marginBottom="size-100">
                      <Picker
                        label="Model"
                        items={models}
                        selectedKey={selectedModel}
                        onSelectionChange={setSelectedModel}
                        contextualHelp={ <ModelInfo />}
                      >
                        {item => <Item key={item.id} textValue={item.id}>{item.id}</Item>}
                      </Picker>
                    </Flex>
                    <Flex marginTop="size-100" marginBottom="size-100">
                      <Slider
                        label="Temperature"
                        value={temperature}
                        onChange={setTemperature}
                        minValue={0}
                        maxValue={1}
                        step={0.05}
                        contextualHelp={<TemperatureInfo />}
                      />
                    </Flex>
                    <Flex marginTop="size-100" marginBottom="size-100">
                      <NumberField
                        label="Max tokens"
                        value={maxTokens}
                        onChange={setMaxTokens}
                        minValue={0}
                        maxValue={8000}
                        contextualHelp={<MaxTokensInfo />}
                      />
                    </Flex>
                  </Flex>
                </Content>
                <ButtonGroup>
                  <Button variant="secondary" onPress={close}>
                    Cancel
                  </Button>
                  <Button variant="cta" onPress={close} autoFocus>
                    Confirm
                  </Button>
                </ButtonGroup>
              </Dialog>
            )}
          </DialogTrigger>
        </header>
        <Grid
          UNSAFE_className="home"
          areas={["header", "input", "code"]}
          columns={["1fr"]}
          rows={["size-2000", "size-1000", "auto"]}
          height="100%"
          gap="size-100"
        >
          <View padding="size-100" gridArea="header">
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <h1 className="spectrum-Heading1 spectrum-Article articleHeader">
                Text2UI with React Spectrum
              </h1>
              <p className="spectrum-Body3">
                Use NLP to generate working UIs with React Spectrum components.
              </p>
            </Flex>
          </View>
          <View gridArea="input" padding="size-100">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <TextField
                name="prompt"
                autoComplete="off"
                autoFocus
                minWidth="size-6000"
                label="Describe your app"
                value={userInput}
                onChange={setUserInput}
              />
              <Button
                isDisabled={isLoading}
                variant="cta"
                marginStart="size-100"
                onPress={() => handleGenerate()}
              >
                <MagicWand />
                <Text>Generate</Text>
              </Button>
            </form>
          </View>
          <View maxWidth="100%" gridArea="code" padding="size-500" margin="auto">
            <Editor code={code} isLoading={isLoading} />
          </View>
        </Grid>
        <DialogContainer onDismiss={() => setAlert(null)}>
          {alert &&
            <AlertDialog
              title="Error"
              variant="warning"
              primaryActionLabel="OK">
              {alert}
            </AlertDialog>
          }
        </DialogContainer>
      </Provider>
    </SSRProvider>
  );
}
