import React, { useEffect, useState } from "react";
import {
  defaultTheme,
  Provider,
  Key,
  Dialog,
  Heading,
  Divider,
  Content,
  Button,
  DialogContainer,
  ButtonGroup,
  ProgressCircle,
} from "@adobe/react-spectrum";
import Head from "next/head";
import { SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";
import { PromptBar } from "../components/PromptBar";
import { Editor } from "../components/Editor";
import { defaultCustomSetup, defaultFiles } from "../data/sandpack";
import { Run, Thread } from "../data/types";
import { createRun, getRun, submitToolOutputs } from "../api/runs";
import { createThread } from "../api/threads";
import { createMessage } from "../api/messages";
import { Preview } from "../components/Preview";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PreviewToolbar from "../components/PreviewToolbar";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import { listAssistants } from "../api/assistants";
import { Link, Radio, RadioGroup } from "react-aria-components";

export default function Home(): JSX.Element {
  let [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  let [files, setFiles] = useState(defaultFiles);
  let [isGenerating, setIsGenerating] = useState(false);
  let [thread, setThread] = useState<Thread | null>(null);
  let [assistants, setAssistants] = useState<Assistant[] | null>(null);
  let [selectedAssistantId, setSelectedAssistantId] = useState<Key | null>(
    null
  );
  let assistantId = selectedAssistantId?.toString();
  let [showSelectAssistant, setShowSelectAssistant] = useState(true);

  // Load assistants
  useEffect(() => {
    (async () => {
      let assistants = await listAssistants();
      setAssistants(assistants.data);
      setSelectedAssistantId(assistants.data[0].id);
    })();
  }, []);

  // Define functions that update files
  let updateFile = (path: string, code: string) => {
    setFiles((files) => {
      return {
        ...files,
        [path]: {
          ...files[path],
          code,
        },
      };
    });
  };

  let addFile = (path: string, code: string) => {
    setFiles((files) => {
      return {
        ...files,
        [path]: {
          code,
        },
      };
    });
  };

  // Inspired by https://github.com/vercel/ai/blob/main/examples/next-openai/app/api/assistant/route.ts
  let waitForRun = async (run: Run) => {
    // Poll for status change
    while (run.status === "queued" || run.status === "in_progress") {
      // delay for 500ms:
      await new Promise((resolve) => setTimeout(resolve, 500));

      run = await getRun(run.thread_id, run.id);
    }

    // Check the run status
    if (
      run.status === "cancelled" ||
      run.status === "cancelling" ||
      run.status === "failed" ||
      run.status === "expired"
    ) {
      throw new Error(run.status);
    }

    if (run.status === "requires_action") {
      if (run.required_action?.type === "submit_tool_outputs") {
        const tool_outputs =
          run.required_action.submit_tool_outputs.tool_calls.map((toolCall) => {
            const args = JSON.parse(toolCall.function.arguments);
            if (toolCall.function.name === "updateFile") {
              updateFile(args.path, args.code);
            } else if (toolCall.function.name === "addFile") {
              addFile(args.path, args.code);
            } else {
              throw new Error(
                `Unknown tool call function: ${toolCall.function.name}`
              );
            }
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify({
                success: true,
                errors: [],
              }),
            };
          });

        run = await submitToolOutputs(run.thread_id, run.id, {
          tool_outputs,
        });

        await waitForRun(run);
      }
    }
  };

  let onSubmitPrompt = async (value: string) => {
    if (thread) {
      setIsGenerating(true);
      // Send message to existing thread
      await createMessage(thread.id, {
        role: "user",
        content: value,
      });

      // Run the thread
      let nextRun = await createRun(thread.id, {
        assistant_id: assistantId,
      });

      await waitForRun(nextRun);
      setIsGenerating(false);
    } else {
      setIsGenerating(true);

      // Create a thread with a message
      let newThread = await createThread({
        messages: [
          {
            role: "user",
            content: value,
          },
        ],
      });

      setThread(newThread);

      // Run the thread
      let initialRun = await createRun(newThread.id, {
        assistant_id: assistantId,
      });

      await waitForRun(initialRun);
      setIsGenerating(false);
    }
  };

  function AssistantDialog() {
    return (
      <Dialog>
        <Heading>Select an Assistant</Heading>
        <Divider />
        <Content>
          {assistants === null && (
            <ProgressCircle aria-label="Loading assistants" />
          )}
          {assistants?.length === 0 && "No assistants found."}
          {assistants?.length > 0 && (
            <RadioGroup
              className="flex items-center justify-center space-y-2 text-center"
              aria-label="Available assistants"
              value={selectedAssistantId.toString()}
              onChange={setSelectedAssistantId}
            >
              {assistants?.map((assistant) => (
                <Radio
                  key={assistant.id}
                  value={assistant.id.toString()}
                  className="flex justify-center bg-white border rounded dark:bg-black p-160 m-160 h-1200 w-2000 focus:outline-none focus-visible:ring-half focus-visible:ring-offset-0 selected:bg-accent-100 selected:border-accent-700"
                >
                  {({ isSelected }) => (
                    <div className="relative flex flex-col items-center justify-center w-full h-full gap-150">
                      {isSelected && (
                        <div className="absolute top-0 left-0 -mt-75 -ml-75">
                          <div className="h-[14px] w-[14px] bg-accent-900 rounded-small">
                            <svg
                              className="fill-gray-75 pt-[2px] pl-[2px] w-[14px] h-[14px]"
                              focusable="false"
                              aria-hidden="true"
                              role="img"
                            >
                              <path d="M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="font-semibold">{assistant.name}</div>
                      {assistant.description && (
                        <div className="text-sm">{assistant.description}</div>
                      )}
                    </div>
                  )}
                </Radio>
              ))}
            </RadioGroup>
          )}
          {assistants !== null && (
            <div className="text-center">
              <Link
                className="font-medium underline text-accent-1000"
                href="https://platform.openai.com/assistants"
              >
                Create an assistant
              </Link>
            </div>
          )}
        </Content>
        <ButtonGroup>
          <Button
            variant="accent"
            onPress={() => setShowSelectAssistant(false)}
          >
            Start
          </Button>
        </ButtonGroup>
      </Dialog>
    );
  }

  return (
    <Provider colorScheme={colorScheme} theme={defaultTheme} locale="en-US">
      <Head>
        <title>GenUI Studio</title>
      </Head>
      <SandpackProvider
        files={files}
        customSetup={defaultCustomSetup}
        theme={colorScheme}
        template="react"
      >
        <SandpackLayout style={{ border: "none" }}>
          <Editor colorScheme={colorScheme} />
          <Preview />
          <PreviewToolbar>
            <div className="absolute right-75">
              <ThemeSwitcher setColorScheme={setColorScheme} />
            </div>
          </PreviewToolbar>
        </SandpackLayout>
      </SandpackProvider>
      <PromptBar isGenerating={isGenerating} onSubmit={onSubmitPrompt} />
      <DialogContainer
        isDismissable={false}
        onDismiss={() => setShowSelectAssistant(false)}
      >
        {showSelectAssistant && <AssistantDialog />}
      </DialogContainer>
    </Provider>
  );
}
