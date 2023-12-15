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
import { SelectAssistantDialog } from "../components/SelectAssistantDialog";
import Main from "./main";
import { listModels } from "../api/models";
import { CreateOrEditAssistantDialog } from "../components/CreateOrEditAssistantDialog";
import { Model } from "openai/resources";

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
  let [showSelectAssistantDialog, setSelectShowSelectAssistantDialog] =
    useState(true);
  let [showCreateOrEditAssistantDialog, setCreateShowSelectAssistantDialog] =
    useState(false);
  let [models, setModels] = useState<Model[] | null>(null);
  let [isEditMode, setIsEditMode] = useState<boolean>(false);
  let [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
    null
  );

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
      let myModels = await listModels();
      setModels(myModels.data);
    })();
  }, []);

  let refreshAssistants = async () => {
    let assistants = await listAssistants();
    setAssistants(assistants.data);
  };

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
        options={{ autoReload: true }}
      >
        {assistantId && (
          <Main
            colorScheme={colorScheme}
            setColorScheme={setColorScheme}
            assistantId={assistantId}
            models={models}
          />
        )}
      </SandpackProvider>
      <DialogContainer
        isDismissable={false}
        onDismiss={() => setSelectShowSelectAssistantDialog(false)}
      >
        {showSelectAssistantDialog && (
          <SelectAssistantDialog
            assistants={assistants}
            assistantSelectorValue={assistantSelectorValue}
            setAssistantSelectorValue={setAssistantSelectorValue}
            setSelectShowSelectAssistantDialog={
              setSelectShowSelectAssistantDialog
            }
            setSelectedAssistantId={setSelectedAssistantId}
            setCreateShowSelectAssistantDialog={
              setCreateShowSelectAssistantDialog
            }
            setIsEditMode={setIsEditMode}
            setEditingAssistant={setEditingAssistant}
            refreshAssistants={refreshAssistants}
          />
        )}
        {showCreateOrEditAssistantDialog && (
          <CreateOrEditAssistantDialog
            models={models}
            setSelectShowSelectAssistantDialog={
              setSelectShowSelectAssistantDialog
            }
            setCreateShowSelectAssistantDialog={
              setCreateShowSelectAssistantDialog
            }
            editingAssistant={editingAssistant}
            setEditingAssistant={setEditingAssistant}
            refreshAssistants={refreshAssistants}
          />
        )}
      </DialogContainer>
    </Provider>
  );
}
