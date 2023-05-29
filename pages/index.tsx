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
  ComboBox,
  ListView,
  Link,
} from "@adobe/react-spectrum";
import MagicWand from "@spectrum-icons/workflow/MagicWand";
import Settings from "@spectrum-icons/workflow/Settings";
import { Editor } from "./Editor";
import { TemperatureInfo } from "./info/TemperatureInfo";
import { ModelInfo } from "./info/ModelInfo";
import { MaxTokensInfo } from "./info/MaxTokensInfo";
import examples from "./examples.json";
import Head from "next/head";
import Info from "@spectrum-icons/workflow/Info";
import InfoOutline from "@spectrum-icons/workflow/InfoOutline";

const DEFAULT_PROMPT = `You're an expert AI programming assistant
- Follow the user's requirements carefully & to the letter
- First think step-by-step - describe your plan for what to build in psuedocode, written out in great detail
- Minimize any prose
- All components are from the React Spectrum library: '@adobe/react-spectrum'

Here is the user's prompt: {{prompt}}.
`;

const STOP_SEQUENCE = "export default App;";

type TimelineItem = {
  id: number;
  index: number;
  title: string;
  description: string;
  type: "create" | "fix" | "update";
  outline?: string;
};

let timeLine: TimelineItem[] = [
  {
    id: 1,
    index: 0,
    title: "Created TODO app",
    description: "Created a TODO app using React Spectrum",
    type: "create",
    outline: `1. Create a new React Spectrum project
    2. Create a new file called 'TodoItem.tsx'
    3. Create a new file called 'TodoList.tsx'
    4. Create a new file called 'TodoApp.tsx'
    5. Create a new file called 'index.tsx'
    6. Create a new file called 'styles.css'
    7. Create a new file called 'TodoItem.css'  
    8. Create a new file called 'TodoList.css'
    9. Create a new file called 'TodoApp.css'`,
  },
  {
    id: 2,
    index: 1,
    title: "Fix bugs",
    description: "Fixed initial bugs in the TODO app",
    type: "fix",
    outline: `1. Fix the bug where the TODO app doesn't render`,
  },
];

let getFullPrompt = (prompt: string, userInput: string) => {
  // let components = Object.keys(examples).filter((componentName) =>
  //   userInput.includes(componentName)
  // );
  // let examplesString = components
  //   .map((component) =>
  //     examples[component]
  //       .map(
  //         (example) =>
  //           `description: ${example.description}\n    code: ${example.code}\n\n`
  //       )
  //       .join("\n")
  //   )
  //   .join("\n");
  return prompt.replace("{{prompt}}", userInput);
  // .replace("{{examples}}", examplesString);
};

export default function Home(): JSX.Element {
  let [userInput, setUserInput] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [code, setCode] = useState(null);
  let [alert, setAlert] = useState<null | string>(null);
  let [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  let [showTinelineModal, setShowTimelineModal] = useState(false);
  let [selectedTimelineItem, setSelectedTimelineItem] =
    useState<TimelineItem>(null);

  let [selectedModel, setSelectedModel] = useState<Key>("code-davinci-002");
  let [temperature, setTemperature] = useState(0);
  let [maxTokens, setMaxTokens] = useState(2048);
  let [models, setModels] = useState([]);

  useEffect(() => {
    fetchModels();
  }, []);

  let fetchModels = async () => {
    try {
      let res = await fetch(`api/models`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let json = await res.json();
      if (json.error) {
        setAlert(json.error.message);
      } else {
        setModels(json.data);
        setSelectedModel("gpt-4" || "gpt-3.5-turbo" || "code-davinci-002");
      }
    } catch (error) {
      setAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  let fetchCompletion = async () => {
    setIsLoading(true);

    try {
      let res = await fetch(`api/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: getFullPrompt(prompt, userInput),
          temperature,
          max_tokens: maxTokens,
          stop: STOP_SEQUENCE,
        }),
      });
      let json = await res.json();
      if (json.error) {
        setAlert(json.error.message);
      } else {
        console.log(json.response);
        setCode(json.response.trim().concat(`\n\n${STOP_SEQUENCE}`));
      }
    } catch (error) {
      setAlert(error);
    } finally {
      setIsLoading(false);
    }
  };

  let handleCreate = () => {
    if (userInput.trim() === "") {
      setAlert("Please provide a prompt");
    } else {
      fetchCompletion();
    }
  };

  let getTimeLineItemCode = (id: number) => {
    return localStorage.getItem(`timeline-item-${id}-code`);
  };

  let saveTimeLineCode = (id: number, code: string) => {
    localStorage.setItem(`timeline-item-${id}-code`, code);
  };

  return (
    <SSRProvider>
      <Provider theme={defaultTheme} locale="en-US">
        <Head>
          <title>GenUI | React Spectrum</title>
        </Head>
        <View padding="size-100" height="100%">
          <Grid
            areas={[
              "header header",
              "prompt  code",
              "timeline code",
              "timeline  code",
              "timeline  code",
            ]}
            columns={["2fr", "4fr"]}
            rows={["size-1000", "auto"]}
            height="100%"
            gap="size-100"
          >
            <View gridArea="header" padding="size-100">
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h1>GenUI with React Spectrum</h1>

                <DialogTrigger isDismissable>
                  <ActionButton isQuiet aria-label="About" margin="size-100">
                    <InfoOutline />
                  </ActionButton>
                  {() => (
                    <Dialog size="L">
                      <Heading>About</Heading>
                      <Divider />
                      <Content>
                        GenUI is an application for helping you generate working
                        React Spectrum apps based on a prompt.
                        <br />
                        <br />
                        Your prompt can be as simple or detailed as needed, and
                        you can include specific React Spectrum components that
                        you would like it to use if you like.
                        <br />
                        <br />
                        When sending a request, you'll get a detailed overview
                        of the app, as well as working code delivered in a live
                        code sandbox.
                        <br />
                        <br />
                        From there, you can also prompt the model to fix any
                        bugs that the your app may have. GenUI will have access
                        to any error messages, so it will include this as
                        context, along with an optional text prompt if you would
                        like to include hints as to how to fix it.
                        <br />
                        <br />
                        You can also add additional features to your existing
                        app using the text prompt.
                        <br />
                        <br />
                        Each change will be included in a timeline view, so you
                        can revert back to any state of the app at any time you
                        need to. Your sandbox can be forked at any time, and
                        initialized as a GitHub repo. Or, you can save your
                        timeline locally, and import it later in a future
                        session.
                        <br />
                        <br />
                        <Divider size="S" marginBottom="size-100" />
                        <Link>
                          <a
                            href="https://react-spectrum.adobe.com"
                            target="_blank"
                          >
                            React Spectrum Documentation
                          </a>
                        </Link>
                      </Content>
                    </Dialog>
                  )}
                </DialogTrigger>
              </header>
            </View>
            <View
              borderWidth="thin"
              borderColor="light"
              borderRadius="medium"
              gridArea="prompt"
              padding="size-100"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreate();
                }}
                style={{
                  height: "100%",
                }}
              >
                <TextArea
                  name="prompt"
                  autoComplete="off"
                  autoFocus
                  minWidth="size-6000"
                  label="Describe your app"
                  value={userInput}
                  onChange={setUserInput}
                  height="100%"
                  width="100%"
                />
                <Flex
                  justifyContent="end"
                  position="relative"
                  bottom={50}
                  right={10}
                >
                  <Button
                    isDisabled={isLoading}
                    variant="cta"
                    marginStart="size-100"
                    marginTop="size-100"
                    onPress={() => handleCreate()}
                  >
                    <MagicWand />
                    <Text>Create</Text>
                  </Button>
                </Flex>
              </form>
            </View>
            <View
              gridArea="timeline"
              padding="size-100"
              borderWidth="thin"
              borderColor="light"
              borderRadius="medium"
            >
              <h2>Timeline</h2>
              <ListView
                items={timeLine}
                width="100%"
                maxWidth={600}
                margin="auto"
              >
                {(item) => (
                  <Item textValue={item.title}>
                    <Text>
                      {item.index + 1}. {item.title}
                    </Text>
                    <Text slot="description">{item.type}</Text>
                    <ActionButton onPress={() => setSelectedTimelineItem(item)}>
                      <InfoOutline />
                    </ActionButton>
                  </Item>
                )}
              </ListView>
            </View>
            <View gridArea="code">
              <Editor code={code} isLoading={isLoading} />
            </View>
          </Grid>
        </View>

        <DialogContainer onDismiss={() => setAlert(null)}>
          {alert && (
            <AlertDialog
              title="Error"
              variant="warning"
              primaryActionLabel="OK"
            >
              {alert}
            </AlertDialog>
          )}
        </DialogContainer>

        <DialogContainer
          type="fullscreen"
          onDismiss={() => setSelectedTimelineItem(null)}
        >
          {selectedTimelineItem && (
            <Dialog size="L">
              <Heading>{selectedTimelineItem.title}</Heading>
              <Divider />
              <Content>
                {selectedTimelineItem.outline}
                <Editor code={getTimeLineItemCode(selectedTimelineItem.id)} />
              </Content>
              <ButtonGroup>
                <Button
                  variant="secondary"
                  onPress={() => setSelectedTimelineItem(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onPress={() => setSelectedTimelineItem(null)}
                >
                  Restore
                </Button>
              </ButtonGroup>
            </Dialog>
          )}
        </DialogContainer>
      </Provider>
    </SSRProvider>
  );
}
