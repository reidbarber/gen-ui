import { ActionButton } from "@adobe/react-spectrum";
import Moon from "@spectrum-icons/workflow/Moon";
import Light from "@spectrum-icons/workflow/Light";
import { ColorScheme, useColorScheme } from "../context/ColorSchemeContext";

export default function ThemeSwitcher() {
  let { colorScheme, setColorScheme } = useColorScheme();
  let label =
    colorScheme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  let otherScheme: ColorScheme = colorScheme === "light" ? "dark" : "light";

  return (
    <ActionButton
      isQuiet
      aria-label={label}
      onPress={() => setColorScheme(otherScheme)}
    >
      {colorScheme === "dark" ? <Light /> : <Moon />}
    </ActionButton>
  );
}
