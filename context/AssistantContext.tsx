import React, { createContext, useState, useContext, useEffect } from "react";
import { sandpackConfigs } from "../data/sandpack";
import { Assistant } from "../data/types";
import { Key } from "@adobe/react-spectrum";
import { listAssistants } from "../api/assistants";
import { listModels } from "../api/models";
import { useModels } from "./ModelsContext";

interface AssistantContextType {
  sandpackConfig: any;
  setSandpackConfig: React.Dispatch<React.SetStateAction<any>>;
  assistants: Assistant[] | null;
  setAssistants: React.Dispatch<React.SetStateAction<Assistant[] | null>>;
  assistantSelectorValue: Key | null;
  setAssistantSelectorValue: React.Dispatch<React.SetStateAction<Key | null>>;
  selectedAssistantId: Key | null;
  setSelectedAssistantId: React.Dispatch<React.SetStateAction<Key | null>>;
  assistantId: string | null;
  refreshAssistants: () => Promise<void>;
  editingAssistant: Assistant | null;
  setEditingAssistant: React.Dispatch<React.SetStateAction<Assistant | null>>;
  showSelectAssistantDialog: boolean;
  setSelectShowSelectAssistantDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  showCreateOrEditAssistantDialog: boolean;
  setCreateShowSelectAssistantDialog: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

const AssistantContext = createContext<AssistantContextType | undefined>(
  undefined
);

interface AssistantProviderProps {
  children: React.ReactNode;
}

export const AssistantProvider = ({ children }: AssistantProviderProps) => {
  let { setModels } = useModels();

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
  let [editingAssistant, setEditingAssistant] = useState<Assistant | null>(
    null
  );
  let [showSelectAssistantDialog, setSelectShowSelectAssistantDialog] =
    useState(true);
  let [showCreateOrEditAssistantDialog, setCreateShowSelectAssistantDialog] =
    useState(false);

  let refreshAssistants = async () => {
    let assistants = await listAssistants();
    setAssistants(assistants.data);
  };

  // Load assistants
  useEffect(() => {
    (async () => {
      let assistants = await listAssistants();
      setAssistants(assistants.data);
      setAssistantSelectorValue(assistants.data[0].id);
      let models = await listModels();
      setModels(models.data);
    })();
  }, []);

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

  return (
    <AssistantContext.Provider
      value={{
        sandpackConfig,
        setSandpackConfig,
        assistants,
        setAssistants,
        assistantSelectorValue,
        setAssistantSelectorValue,
        selectedAssistantId,
        setSelectedAssistantId,
        assistantId,
        refreshAssistants,
        editingAssistant,
        setEditingAssistant,
        showSelectAssistantDialog,
        setSelectShowSelectAssistantDialog,
        showCreateOrEditAssistantDialog,
        setCreateShowSelectAssistantDialog,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (context === undefined) {
    throw new Error("useAssistant must be used within a AssistantProvider");
  }
  return context;
};
