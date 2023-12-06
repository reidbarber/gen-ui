import React, { useEffect, useRef } from "react";
import { defaultTheme, Provider } from "@adobe/react-spectrum";
import Head from "next/head";
import {
  SandpackProvider,
  SandpackPreview,
  SandpackLayout,
} from "@codesandbox/sandpack-react";
import { PromptBar } from "../components/PromptBar";
import { Editor } from "../components/Editor";
import { defaultCustomSetup, defaultFiles } from "../data/sandpack";
import { Run, Thread, ThreadMessage } from "../data/types";

export default function Home(): JSX.Element {
  let [files, setFiles] = React.useState(defaultFiles);
  let [hasSentPrompt, setHasSentPrompt] = React.useState(false);
  let [isGenerating, setIsGenerating] = React.useState(false);

  let [threadId, setThreadId] = React.useState<string | null>(null);
  let [thread, setThread] = React.useState<Thread | null>(null);
  let [awaitingRun, setAwaitingRun] = React.useState<Run | null>(null);

  // Check run status every 3 seconds
  useEffect(() => {
    if (awaitingRun && awaitingRun.expires_at > Date.now() / 1000) {
      let interval = setInterval(async () => {
        let run = await fetch("/api/runs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            runId: awaitingRun.id,
            threadId: threadId,
          }),
        }).then((res) => res.json());
        if (run.status === "completed") {
          setAwaitingRun(null);
          setIsGenerating(false);
          let thread = await fetch("/api/threads", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              threadId: threadId,
            }),
          }).then((res) => res.json());
          setThread(thread);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [awaitingRun]);

  let onSubmitPrompt = async (value: string) => {
    if (hasSentPrompt) {
      // Send message to thread
      let message: ThreadMessage = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: threadId,
          content: value,
        }),
      }).then((res) => res.json());
      setIsGenerating(true);
    } else {
      setHasSentPrompt(true);
      setIsGenerating(true);

      // Initialize thread
      let initialRun: Run = await fetch("/api/createAndRun", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              content: value,
              role: "user",
            },
          ],
        }),
      }).then((res) => res.json());

      // Set thread id
      setThreadId(initialRun.thread_id);

      // Get thread and update state
      let thread = await fetch("/api/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          threadId: initialRun.thread_id,
        }),
      }).then((res) => res.json());
      setThread(thread);
    }
  };

  return (
    <Provider theme={defaultTheme} locale="en-US">
      <Head>
        <title>GenUI</title>
      </Head>
      <SandpackProvider
        files={files}
        customSetup={defaultCustomSetup}
        theme="dark"
        template="react"
      >
        <SandpackLayout>
          <Editor />
          <SandpackPreview style={{ height: "100vh" }} />
        </SandpackLayout>
      </SandpackProvider>
      <PromptBar onSubmit={onSubmitPrompt} />
    </Provider>
  );
}
