import React from "react";
import { defaultTheme, Provider, DialogContainer } from "@adobe/react-spectrum";
import Head from "next/head";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { SelectAssistantDialog } from "../components/SelectAssistantDialog";
import Main from "./main";
import { CreateOrEditAssistantDialog } from "../components/CreateOrEditAssistantDialog";
import { useAssistant } from "../context/AssistantContext";
import { useColorScheme } from "../context/ColorSchemeContext";

export default function Home(): JSX.Element {
  let { colorScheme } = useColorScheme();
  let {
    assistantId,
    sandpackConfig,
    showSelectAssistantDialog,
    setSelectShowSelectAssistantDialog,
    showCreateOrEditAssistantDialog,
  } = useAssistant();

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
        {assistantId && <Main />}
      </SandpackProvider>
      <DialogContainer
        isDismissable={false}
        onDismiss={() => setSelectShowSelectAssistantDialog(false)}
      >
        {showSelectAssistantDialog && <SelectAssistantDialog />}
        {showCreateOrEditAssistantDialog && <CreateOrEditAssistantDialog />}
      </DialogContainer>
    </Provider>
  );
}
