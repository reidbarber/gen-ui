import { ActionButton } from "@adobe/react-spectrum";
import Image from "@spectrum-icons/workflow/Image";
import { useState } from "react";
import {
  Group,
  TextField,
  Button,
  Label,
  TextArea,
} from "react-aria-components";

export function PromptBar({ onSubmit }) {
  let [value, setValue] = useState("");
  let onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };
  let [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  return (
    <form
      onSubmit={onFormSubmit}
      className="absolute bottom-0 z-[10000] w-full"
    >
      <Group
        className={`${
          isTextAreaFocused ? "text-area-focused" : ""
        } [.text-area-focused&:has([data-focus-visible])]:ring py-200 px-300 flex flex-col mx-auto my-300 align-middle bg-white dark:bg-black border rounded-[var(--spectrum-global-dimension-size-300)] shadow-md w-[85%]`}
      >
        <TextField
          onFocus={(e) => setIsTextAreaFocused(true)}
          onBlur={() => setIsTextAreaFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(value);
            }
          }}
          value={value}
          onChange={setValue}
          aria-label="Prompt"
          className="block w-full"
        >
          <Label className="text-gray-600">Prompt</Label>
          <TextArea
            placeholder="Describe the app or component you want to generate"
            className="w-full text-black resize-none dark:bg-black dark:text-white p-50 focus:outline-none"
          />
        </TextField>
        <div className="flex justify-between">
          <ActionButton aria-label="Upload image" isQuiet>
            <Image />
          </ActionButton>

          <Button
            type="submit"
            isDisabled={value === ""}
            className="my-auto font-semibold text-white rounded-full disabled:bg-gray-300 disabled:text-gray-500 bg-accent-800 px-150 py-75 focus-visible:ring focus:outline-none"
          >
            Generate
          </Button>
        </div>
      </Group>
    </form>
  );
}
