import React, { useEffect, useState } from "react";
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
import NavBar from "../components/NavBar";
import { Timeline } from "../components/Timeline";
import { OpenInSandboxButton } from "../components/OpenInSandboxButton";
import { Model } from "openai/resources";
import { getImagesDescription } from "../api/vision";
import { useAssistant } from "../context/AssistantContext";
import { useModels } from "../context/ModelsContext";

export default function Main(): JSX.Element {
  let { models } = useModels();
  let { assistantId } = useAssistant();
  let [isGenerating, setIsGenerating] = useState(false);
  let [thread, setThread] = useState<Thread | null>(null);
  let [messages, setMessages] = useState<ThreadMessage[]>([]);
  let [selectedMessageId, setSelectedMessageId] = useState<Key | null>(null);
  let [promptValue, setPromptValue] = useState<string>("");
  let hasVision = (models as Model[])?.some(
    (model) => model.id === "gpt-4-vision-preview"
  );

  let { sandpack, dispatch } = useSandpack();
  let { updateFile, addFile, deleteFile, error } = sandpack;

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

    if (
      run.status === "requires_action" &&
      run.required_action?.type === "submit_tool_outputs"
    ) {
      const tool_outputs =
        run.required_action.submit_tool_outputs.tool_calls.map((toolCall) => {
          const args = JSON.parse(toolCall.function.arguments);
          let output = {
            success: true,
            errors: [],
          };
          switch (toolCall.function.name) {
            case "updateFile":
              updateFile(args.path, args.code);
              break;
            case "addFile":
              addFile(args.path, args.code);
              break;
            case "deleteFile":
              deleteFile(args.path);
              break;
            case "getErrors":
              output["errors"] = error ? [error] : [];
              break;
            case "readFile":
              output["result"] = { content: sandpack.files[args.path].code };
              break;
            case "listFiles":
              output["result"] = { paths: Object.keys(sandpack.files) };
              break;
            default:
              throw new Error(
                `Unknown tool call function: ${toolCall.function.name}`
              );
          }

          return {
            tool_call_id: toolCall.id,
            output: JSON.stringify(output),
          };
        });

      run = await submitToolOutputs(run.thread_id, run.id, {
        tool_outputs,
      });

      await waitForRun(run);
    }
  };

  let onSubmitPrompt = async (value: string, files: File[]) => {
    setIsGenerating(true);

    // Get images descriptions if files are attached
    if (files.length > 0) {
      let imagesDescription = (await getImagesDescription({ images: files }))
        .choices[0].message.content;
      if (imagesDescription) {
        value =
          value +
          "\n\n[UI design image description below]\n\n" +
          imagesDescription;
      }
    }

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
          isGenerating={isGenerating}
        />
        <Editor />
        <Preview />
        <NavBar>
          <div className="absolute text-2xl font-bold w-3000 left-75 py-100 px-150">
            GenUI Studio
          </div>
          <div className="absolute flex gap-100 right-100 pt-50">
            <OpenInSandboxButton />
            <ThemeSwitcher />
          </div>
        </NavBar>
      </SandpackLayout>
      <PromptBar
        messages={messages}
        isGenerating={isGenerating}
        onSubmit={onSubmitPrompt}
        promptValue={promptValue}
        setPromptValue={setPromptValue}
        hasVision={hasVision}
      />
    </>
  );
}
