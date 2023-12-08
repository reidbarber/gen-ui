import React, { useEffect, useState } from "react";
import {
  defaultTheme,
  Provider,
  Key,
  DialogContainer,
} from "@adobe/react-spectrum";
import Head from "next/head";
import { SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";
import { PromptBar } from "../components/PromptBar";
import { Editor } from "../components/Editor";
import { defaultCustomSetup, defaultFiles } from "../data/sandpack";
import { Run, Thread, ThreadMessage } from "../data/types";
import { createRun, getRun, submitToolOutputs } from "../api/runs";
import { createThread } from "../api/threads";
import { createMessage, listMessages } from "../api/messages";
import { Preview } from "../components/Preview";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PreviewToolbar from "../components/PreviewToolbar";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import { listAssistants } from "../api/assistants";
import { AssistantDialog } from "../components/AssistantDialog";

export default function Home(): JSX.Element {
  let [colorScheme, setColorScheme] = useState<"light" | "dark">("dark"); // TODO: Default to system
  let [files, setFiles] = useState(defaultFiles);
  let [isGenerating, setIsGenerating] = useState(false);
  let [thread, setThread] = useState<Thread | null>(null);
  let [assistants, setAssistants] = useState<Assistant[] | null>(null);
  let [selectedAssistantId, setSelectedAssistantId] = useState<Key | null>(
    null
  );
  let assistantId = selectedAssistantId?.toString();
  let [showAssistantDialog, setShowAssistantDialog] = useState(true);
  let [messages, setMessages] = useState<ThreadMessage[]>([]);
  let [selectedMessageId, setSelectedMessageId] = useState<Key | null>(null);
  let [promptValue, setPromptValue] = useState<string>("");

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
      throw new Error(run.status); // TODO: Show alert
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
      let message = await createMessage(thread.id, {
        role: "user",
        content: value,
      });
      setMessages((messages) => [...messages, message]);
      setSelectedMessageId(message.id);
      setPromptValue("");

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
      let messages = await listMessages(newThread.id);
      setMessages(messages.data);
      setSelectedMessageId(messages.data[messages.data.length - 1].id);
      setPromptValue("");

      setThread(newThread);

      // Run the thread
      let initialRun = await createRun(newThread.id, {
        assistant_id: assistantId,
      });

      await waitForRun(initialRun);
      setIsGenerating(false);
    }
  };

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
      <PromptBar
        messages={messages}
        selectedMessageId={selectedMessageId}
        setSelectedMessageId={setSelectedMessageId}
        isGenerating={isGenerating}
        onSubmit={onSubmitPrompt}
        promptValue={promptValue}
        setPromptValue={setPromptValue}
      />
      <DialogContainer
        isDismissable={false}
        onDismiss={() => setShowAssistantDialog(false)}
      >
        {showAssistantDialog && (
          <AssistantDialog
            assistants={assistants}
            assistantId={assistantId}
            setSelectedAssistantId={setSelectedAssistantId}
            setShowAssistantDialog={setShowAssistantDialog}
          />
        )}
      </DialogContainer>
    </Provider>
  );
}
