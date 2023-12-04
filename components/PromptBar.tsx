import { useState } from "react";
import { Input, Group, TextField, Button } from "react-aria-components";

export function PromptBar({ onSubmit }) {
  let [value, setValue] = useState("");
  let [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  let onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };
  return (
    <form
      onSubmit={onFormSubmit}
      className="absolute bottom-0 z-[10000] w-full"
    >
      <Group
        className={`flex mx-auto my-300 align-middle bg-white dark:bg-black border rounded-full shadow-md h-800 w-[85%] ${
          isTextFieldFocused ? "ring" : ""
        }`}
      >
        <TextField
          onFocus={() => setIsTextFieldFocused(true)}
          onBlur={() => setIsTextFieldFocused(false)}
          value={value}
          onChange={setValue}
          aria-label="Prompt"
          className="flex-grow h-full p-150"
        >
          <Input className="w-full h-full text-xl font-semibold text-black dark:bg-black dark:text-white p-50 focus:outline-none" />
        </TextField>
        <Button
          type="submit"
          isDisabled={value === ""}
          className="self-end my-auto font-semibold text-white rounded-full disabled:bg-gray-300 disabled:text-gray-500 mx-200 bg-accent-800 p-150 focus-visible:ring focus:outline-none"
        >
          Generate
        </Button>
      </Group>
    </form>
  );
}
