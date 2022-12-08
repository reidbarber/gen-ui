import React, { useEffect, useState } from "react";
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
  ComboBox,
} from "@adobe/react-spectrum";
import MagicWand from "@spectrum-icons/workflow/MagicWand";
import Settings from "@spectrum-icons/workflow/Settings";
// import "./index.css";
import { Editor } from "./Editor";
import { TemperatureInfo } from "./info/TemperatureInfo";
import { ModelInfo } from "./info/ModelInfo";
import { MaxTokensInfo } from "./info/MaxTokensInfo";
import prompts from './prompts.json';

let getFullPrompt = (userPrompt: string) => {
  let components = Object.keys(prompts).filter(componentName => userPrompt.includes(componentName));
  return `/*
    - Use React Spectrum components to build a React component called App, made with function components and hooks.
    - Import components from the @adobe/react-spectrum package

    ${components.map((component) => `description: ${prompts[component].description}\ncomponent: ${prompts[component].example}\n\n`)}

    - This app has a ${userPrompt.trim()}.
*/`;}

const STOP_SEQUENCE = 'export default App;';

export default function Home(): JSX.Element {
  let [promptValue, setPromptValue] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [code, setCode] = useState(null);
  let [alert, setAlert] = useState<null | string>(null);

  let [selectedModel, setSelectedModel] = useState(
    "code-davinci-002" as React.Key
  );
  let [temperature, setTemperature] = useState(0);
  let [maxTokens, setMaxTokens] = useState(2048);
  let [models, setModels] = useState([])

  useEffect(() => {
    fetchModels();
  }, []);

  let modelOptions = [
    {
      name: "Codex",
      children: [{ id: "code-davinci-002" }, { id: "code-cushman-001" }],
    },
    {
      name: "GPT-3",
      children: [
        { id: "text-davinci-002" },
        { id: "text-curie-001" },
        { id: "text-babbage-001" },
        { id: "text-ada-001" },
      ],
    },
  ];

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
          prompt: getFullPrompt(promptValue),
          temperature,
          max_tokens: maxTokens,
          stop: STOP_SEQUENCE
        }),
      });
      let json = await res.json();
      if (json.error) {
        setAlert(json.error.message);
      } else {
        console.log(json);
        setCode(json.choices[0].text.trim().concat(`\n\n${STOP_SEQUENCE}`));
      }
    } catch (error) {
      // TODO: check error message
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
        console.log(json);
      }
    } catch (error) {
      // TODO: check error message
      setAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  let handleGenerate = () => {
    if (promptValue.trim() === '') {
      setAlert('Please provide a prompt');
    } else {
      fetchCompletion();
    }
  }

  return (
    <SSRProvider>
      <Provider theme={defaultTheme} locale="en-US">
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
                      <ComboBox
                        label="Model"
                        defaultItems={models}
                        selectedKey={selectedModel}
                        onSelectionChange={setSelectedModel}
                        contextualHelp={ <ModelInfo />}
                      >
                        {item => <Item key={item.id} textValue={item.id}>{item.id}</Item>}
                      </ComboBox>
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
                        maxValue={4096}
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
          areas={["header", "input", "code"]}
          columns={["1fr"]}
          rows={["size-2000", "size-2000", "auto"]}
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
                value={promptValue}
                onChange={setPromptValue}
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
          <View maxWidth="100%" gridArea="code" padding="size-100" paddingStart="size-1000" paddingEnd="size-1000">
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
