import React, { createContext, useState, useContext } from "react";
import { Model } from "openai/resources";

interface ModelsContextType {
  models: Model[] | null;
  setModels: React.Dispatch<React.SetStateAction<Model[] | null>>;
}

const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

interface ModelsProviderProps {
  children: React.ReactNode;
}

export const ModelsProvider = ({ children }: ModelsProviderProps) => {
  let [models, setModels] = useState<Model[] | null>(null);
  return (
    <ModelsContext.Provider
      value={{
        models,
        setModels,
      }}
    >
      {children}
    </ModelsContext.Provider>
  );
};

export const useModels = () => {
  const context = useContext(ModelsContext);
  if (context === undefined) {
    throw new Error("useModels must be used within a ModelsProvider");
  }
  return context;
};
