import React from "react";
import { ActionButton, useProvider } from "@adobe/react-spectrum";
import Moon from "@spectrum-icons/workflow/Moon";
import Light from "@spectrum-icons/workflow/Light";

export const ThemeSwitcher = ({ setColorScheme }) => {
  let { colorScheme } = useProvider();
  return (
    <div>
      <ActionButton
        isQuiet
        onPress={() =>
          setColorScheme(colorScheme === "dark" ? "light" : "dark")
        }
      >
        {colorScheme === "dark" ? <Light /> : <Moon />}
      </ActionButton>
    </div>
  );
};
