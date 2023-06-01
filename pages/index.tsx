import React, { Key, useEffect, useState } from "react";
import {
  Grid,
  View,
  defaultTheme,
  Provider,
  Button,
  Text,
  ActionButton,
  DialogTrigger,
  Heading,
  Content,
  Dialog,
  Divider,
  ButtonGroup,
  Flex,
  Item,
  DialogContainer,
  AlertDialog,
  SSRProvider,
  TextArea,
  ListView,
  Link,
} from "@adobe/react-spectrum";
import MagicWand from "@spectrum-icons/workflow/MagicWand";
import Settings from "@spectrum-icons/workflow/Settings";
import { Editor } from "./Editor";
import { TemperatureInfo } from "./info/TemperatureInfo";
import { ModelInfo } from "./info/ModelInfo";
import { MaxTokensInfo } from "./info/MaxTokensInfo";
import Head from "next/head";
import InfoOutline from "@spectrum-icons/workflow/InfoOutline";
import { ThemeSwitcher } from "./ThemeSwitcher";

type TimelineItem = {
  id: number;
  index: number;
  title: string;
  description: string;
  type: "create" | "fix" | "update";
  outline?: string;
};

export default function Home(): JSX.Element {
  let [userInput, setUserInput] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  let [code, setCode] = useState(null);
  let [files, setFiles] = useState([]);
  let [alert, setAlert] = useState<null | string>(null);
  let [showTinelineModal, setShowTimelineModal] = useState(false);
  let [selectedTimelineItem, setSelectedTimelineItem] =
    useState<TimelineItem>(null);
  let [timeline, setTimeline] = useState<TimelineItem[]>([]);

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
          prompt: userInput,
          temperature,
          max_tokens: maxTokens,
        }),
      });
      let json = await res.json();
      if (json.error) {
        setAlert(json.error.message);
      } else {
        let id = timeline.length + 1;
        let response = json.response.trim();
        let summary = response
          .split("## Summary")[1]
          .split("## Plan")[0]
          .trim();
        let plan = response.split("## Plan")[1].split("## Code")[0].trim();
        let code = response.split("## Code")[1].trim();
        // Create a JSON object from the code, where each code block is a file.
        // the header of each block has a fifilename="filename" attribute.
        // This will be used to create the files object for the sandpack.
        // JSON object will look like this:
        // {
        //   "App.js": {
        // "code": "..."
        //   },
        let files = JSON.parse(
          `{${code
            .split("```")
            .filter((_, i) => i % 2 === 1)
            .map((code) => {
              let filename = code.split("filename=")[1].split("\n")[0];
              return `"${filename}": {"code": \`${code}\`}`;
            })
            .join(",")}}`
        );
        setFiles(files);
        saveTimelineCode(id, JSON.stringify(files));

        setCode(json.response.trim());
        setTimeline([
          ...timeline,
          {
            id,
            index: timeline.length,
            title: summary,
            description: plan,
            type: "create",
          },
        ]);
        saveTimelineCode(id, code);
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

  let getTimelineItemCode = (id: number) => {
    return localStorage.getItem(`timeline-item-${id}-code`);
  };

  let saveTimelineCode = (id: number, code: string) => {
    localStorage.setItem(`timeline-item-${id}-code`, code);
  };

  let [colorScheme, setColorScheme] = useState(undefined);

  return (
    <SSRProvider>
      <Provider theme={defaultTheme} locale="en-US" colorScheme={colorScheme}>
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
            rows={["size-800", "auto"]}
            height="100%"
            gap="size-100"
          >
            <View gridArea="header" padding="size-100">
              <header
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Flex alignItems="center">
                  <h1 style={{ margin: "0" }}>GenUI with React Spectrum</h1>
                  <DialogTrigger isDismissable>
                    <ActionButton isQuiet aria-label="About" margin="size-100">
                      <InfoOutline />
                    </ActionButton>
                    {() => (
                      <Dialog size="L">
                        <Heading>About</Heading>
                        <Divider />
                        <Content>
                          GenUI is an application for helping you generate
                          working React Spectrum apps based on a prompt.
                          <br />
                          <br />
                          Your prompt can be as simple or detailed as needed,
                          and you can include specific React Spectrum components
                          that you would like it to use if you like.
                          <br />
                          <br />
                          When sending a request, you'll get a detailed overview
                          of the app, as well as working code delivered in a
                          live code sandbox.
                          <br />
                          <br />
                          From there, you can also prompt the model to fix any
                          bugs that the your app may have. GenUI will have
                          access to any error messages, so it will include this
                          as context, along with an optional text prompt if you
                          would like to include hints as to how to fix it.
                          <br />
                          <br />
                          You can also add additional features to your existing
                          app using the text prompt.
                          <br />
                          <br />
                          Each change will be included in a timeline view, so
                          you can revert back to any state of the app at any
                          time you need to. Your sandbox can be forked at any
                          time, and initialized as a GitHub repo. Or, you can
                          save your timeline locally, and import it later in a
                          future session.
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
                </Flex>
                <ThemeSwitcher setColorScheme={setColorScheme} />
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
              height="100%"
            >
              <h2 id="timeline-header">Timeline</h2>
              <ListView
                aria-labelledby="timeline-header"
                items={timeline}
                width="100%"
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
                <Editor
                  code={null}
                  files={getTimelineItemCode(selectedTimelineItem.id)}
                />
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
