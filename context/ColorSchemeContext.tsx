import React, { createContext, useState, useContext } from "react";

export type ColorScheme = "light" | "dark";

interface ColorSchemeContextType {
  colorScheme: ColorScheme | null;
  setColorScheme: React.Dispatch<React.SetStateAction<ColorScheme | null>>;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(
  undefined
);

interface ColorSchemeProviderProps {
  children: React.ReactNode;
}

export const ColorSchemeProvider = ({ children }: ColorSchemeProviderProps) => {
  let [colorScheme, setColorScheme] = useState<ColorScheme>("dark"); // TODO: Default to system

  return (
    <ColorSchemeContext.Provider
      value={{
        colorScheme,
        setColorScheme,
      }}
    >
      {children}
    </ColorSchemeContext.Provider>
  );
};

export const useColorScheme = () => {
  const context = useContext(ColorSchemeContext);
  if (context === undefined) {
    throw new Error("useColorScheme must be used within a ColorSchemeProvider");
  }
  return context;
};
