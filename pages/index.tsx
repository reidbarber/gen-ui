import React, { useEffect, useState } from "react";
import {
  defaultTheme,
  Provider,
  Key,
  DialogContainer,
} from "@adobe/react-spectrum";
import Head from "next/head";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { sandpackConfigs } from "../data/sandpack";
import { Assistant } from "openai/resources/beta/assistants/assistants";
import { listAssistants } from "../api/assistants";
import { AssistantDialog } from "../components/AssistantDialog";
import Main from "./main";

export default function Home(): JSX.Element {
  let [colorScheme, setColorScheme] = useState<"light" | "dark">("dark"); // TODO: Default to system
  let [sandpackConfig, setSandpackConfig] = useState(
    sandpackConfigs["React Spectrum"]
  );
  let [assistants, setAssistants] = useState<Assistant[] | null>(null);
  let [assistantSelectorValue, setAssistantSelectorValue] =
    useState<Key | null>(null);

  let [selectedAssistantId, setSelectedAssistantId] = useState<Key | null>(
    null
  );
  let assistantId = selectedAssistantId?.toString();
  let [showAssistantDialog, setShowAssistantDialog] = useState(true);

  useEffect(() => {
    if (selectedAssistantId) {
      let name = assistants?.find(
        (assistant) => assistant.id === selectedAssistantId
      )?.name;
      if (sandpackConfigs[name]) {
        setSandpackConfig(sandpackConfigs[name]);
      }
    }
  }, [selectedAssistantId]);

  // Load assistants
  useEffect(() => {
    (async () => {
      let assistants = await listAssistants();
      setAssistants(assistants.data);
      setAssistantSelectorValue(assistants.data[0].id);
    })();
  }, []);

  return (
    <Provider colorScheme={colorScheme} theme={defaultTheme} locale="en-US">
      <Head>
        <title>GenUI Studio</title>
      </Head>
      <SandpackProvider
        files={sandpackConfig.files}
        customSetup={sandpackConfig.customSetup}
        theme={colorScheme}
        template="react"
      >
        {assistantId && (
          <Main
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            assistantId={assistantId}
          />
        )}
      </SandpackProvider>
      <DialogContainer
        isDismissable={false}
        onDismiss={() => setShowAssistantDialog(false)}
      >
        {showAssistantDialog && (
          <AssistantDialog
            assistants={assistants}
            assistantSelectorValue={assistantSelectorValue}
            setAssistantSelectorValue={setAssistantSelectorValue}
            setShowAssistantDialog={setShowAssistantDialog}
            setSelectedAssistantId={setSelectedAssistantId}
          />
        )}
      </DialogContainer>
    </Provider>
  );
}
