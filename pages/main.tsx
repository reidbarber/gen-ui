import React, { use, useEffect, useState } from "react";
import { Key } from "@adobe/react-spectrum";
import { SandpackLayout, useSandpack } from "@codesandbox/sandpack-react";
import { PromptBar } from "../components/PromptBar";
import { Editor } from "../components/Editor";
import { Run, Thread, ThreadMessage } from "../data/types";
import { createRun, getRun, submitToolOutputs } from "../api/runs";
import { createThread } from "../api/threads";
import { createMessage, listMessages } from "../api/messages";
import { Preview } from "../components/Preview";
import ThemeSwitcher from "../components/ThemeSwitcher";
import PreviewToolbar from "../components/PreviewToolbar";
import { Timeline } from "../components/Timeline";

export default function Main({
  setColorScheme,
  colorScheme,
  assistantId,
}): JSX.Element {
  let [isGenerating, setIsGenerating] = useState(false);
  let [thread, setThread] = useState<Thread | null>(null);
  let [messages, setMessages] = useState<ThreadMessage[]>([]);
  let [selectedMessageId, setSelectedMessageId] = useState<Key | null>(null);
  let [promptValue, setPromptValue] = useState<string>("");

  let { sandpack, dispatch } = useSandpack();
  let { updateFile, addFile, deleteFile } = sandpack;

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
            } else if (toolCall.function.name === "addFile") {
              deleteFile(args.path);
            } else {
              throw new Error(
                `Unknown tool call function: ${toolCall.function.name}`
              );
            }
            return {
              tool_call_id: toolCall.id,
              output: JSON.stringify({
                success: true,
                errors: [], // TODO: Handle errors
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
    setIsGenerating(true);
    if (thread) {
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
    } else {
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
    }

    dispatch({ type: "refresh" });
    setIsGenerating(false);
  };

  useEffect(() => {
    dispatch({ type: "refresh" });
  }, [assistantId]);

  return (
    <>
      <SandpackLayout style={{ border: "none" }}>
        <Timeline
          messages={messages}
          selectedMessageId={selectedMessageId}
          setSelectedMessageId={setSelectedMessageId}
        />
        <Editor colorScheme={colorScheme} />
        <Preview />
        <PreviewToolbar>
          <div className="w-3000 absolute left-75 font-bold text-2xl py-50 px-150">
            GenUI Studio
          </div>
          <div className="absolute right-75">
            <ThemeSwitcher setColorScheme={setColorScheme} />
          </div>
        </PreviewToolbar>
      </SandpackLayout>
      <PromptBar
        messages={messages}
        selectedMessageId={selectedMessageId}
        setSelectedMessageId={setSelectedMessageId}
        isGenerating={isGenerating}
        onSubmit={onSubmitPrompt}
        promptValue={promptValue}
        setPromptValue={setPromptValue}
      />
    </>
  );
}
