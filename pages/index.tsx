import React, { useEffect } from "react";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import Head from "next/head";
import { SandpackProvider, SandpackLayout } from "@codesandbox/sandpack-react";
import { PromptBar } from "../components/PromptBar";
import { Editor } from "../components/Editor";
import { defaultCustomSetup, defaultFiles } from "../data/sandpack";
import { Run, Thread } from "../data/types";
import { createThreadAndRun, getRun } from "../api/runs";
import { getThread } from "../api/threads";
import { createMessage } from "../api/messages";
import { Preview } from "../components/Preview";

export default function Home(): JSX.Element {
  let [colorScheme, setColorScheme] = React.useState<"light" | "dark">("dark");
  let [files, setFiles] = React.useState(defaultFiles);
  let [hasSentInitialPrompt, setHasSentInitialPrompt] = React.useState(false);
  let [isGenerating, setIsGenerating] = React.useState(false);

  let [threadId, setThreadId] = React.useState<string | null>(null);
  let [thread, setThread] = React.useState<Thread | null>(null);
  let [awaitingRun, setAwaitingRun] = React.useState<Run | null>(null);

  // Check run status every 3 seconds
  useEffect(() => {
    if (awaitingRun && awaitingRun.expires_at > Date.now() / 1000) {
      let interval = setInterval(async () => {
        let run = await getRun(threadId, awaitingRun.id);
        if (run.status === "completed") {
          setAwaitingRun(null);
          setIsGenerating(false);
          let thread = await getThread(threadId);
          setThread(thread);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [awaitingRun]);

  let onSubmitPrompt = async (value: string) => {
    if (hasSentInitialPrompt) {
      // Send message to thread
      let message = await createMessage(threadId, {
        role: "user",
        content: value,
      });
      setIsGenerating(true);
    } else {
      setHasSentInitialPrompt(true);
      setIsGenerating(true);

      // Initialize thread
      let initialRun = await createThreadAndRun({ assistant_id: "" });

      // Set thread id
      setThreadId(initialRun.thread_id);

      // Get thread and update state
      let thread = await getThread(initialRun.thread_id);
      setThread(thread);
    }
  };

  return (
    <Provider colorScheme={colorScheme} theme={defaultTheme} locale="en-US">
      <Head>
        <title>GenUI</title>
      </Head>
      <SandpackProvider
        files={files}
        customSetup={defaultCustomSetup}
        theme={colorScheme}
        template="react"
      >
        <SandpackLayout>
          <Editor colorScheme={colorScheme} />
          <Preview colorScheme={colorScheme} setColorScheme={setColorScheme} />
        </SandpackLayout>
      </SandpackProvider>
      <PromptBar onSubmit={onSubmitPrompt} />
    </Provider>
  );
}
