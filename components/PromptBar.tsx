import {
  ActionButton,
  FileDropItem,
  TextDropItem,
  Button as SpectrumButton,
} from "@adobe/react-spectrum";
import Image from "@spectrum-icons/workflow/Image";
import ImageAdd from "@spectrum-icons/workflow/ImageAdd";
import { FormEvent, useRef, useState } from "react";
import {
  Group,
  TextField,
  Button,
  Label,
  TextArea,
  FileTrigger,
} from "react-aria-components";
import { useDrop } from "react-aria";

export function PromptBar({ onSubmit, isGenerating }) {
  let [value, setValue] = useState("");
  let onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(value);
  };
  let [isTextAreaFocused, setIsTextAreaFocused] = useState(false);
  let [files, setFiles] = useState([]);
  let ref = useRef(null);
  let { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      let files = await Promise.all(
        e.items
          .filter(
            (item) => item.kind === "file" && item.type.startsWith("image/")
          )
          .map((item: FileDropItem) => item.getFile())
      );
      setFiles((prevFiles) => [...prevFiles, ...files]);

      let text = await Promise.all(
        e.items
          .filter(
            (item) => item.kind === "text" && item.types.has("text/plain")
          )
          .map((item: TextDropItem) => item.getText("text/plain"))
      );
      setValue((prevValue) => prevValue + text.join("\n"));
    },
  });

  return (
    <form
      onSubmit={onFormSubmit}
      className="absolute bottom-0 z-[10000] w-full"
      {...dropProps}
    >
      <Group
        className={`${isTextAreaFocused ? "text-area-focused" : ""} ${
          isDropTarget ? "outline" : ""
        } [.text-area-focused&:has([data-focus-visible])]:outline border-none py-200 px-300 flex flex-col mx-auto my-300 align-middle bg-gray-50 border rounded-[var(--spectrum-global-dimension-size-300)] shadow-md w-[85%]`}
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
            className="w-full bg-transparent resize-none p-50 focus:outline-none"
          />
        </TextField>
        <div className="flex justify-between">
          <div className="flex items-end gap-300">
            {files.length === 0 && (
              <FileTrigger
                acceptedFileTypes={["image/*"]}
                onSelect={(e) => {
                  let files = Array.from(e);
                  setFiles((prevFiles) => [...prevFiles, ...files]);
                }}
              >
                <ActionButton aria-label="Upload image" isQuiet>
                  <Image />
                </ActionButton>
              </FileTrigger>
            )}

            <div className="flex gap-150">
              {files.map((file, index) => (
                <div key={`${file.name}-${index}`} className="relative">
                  <Button
                    aria-label={`Remove image ${file.name}`}
                    onPress={() =>
                      setFiles((prevFiles) =>
                        prevFiles.filter((prevFile) => prevFile !== file)
                      )
                    }
                    className="absolute top-0 right-0 bg-gray-400 rounded-full outline-none -mt-75 -mr-75 h-200 w-200 focus-visible:outline"
                  >
                    <svg
                      className="m-auto text-gray-800 w-75 h-75 dark:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </Button>
                  <img
                    alt="Image preview"
                    className="object-cover border border-gray-300 rounded h-800 w-800"
                    src={URL.createObjectURL(file)}
                  />
                </div>
              ))}
              {files.length > 0 && (
                <FileTrigger
                  acceptedFileTypes={["image/*"]}
                  onSelect={(e) => {
                    let files = Array.from(e);
                    setFiles((prevFiles) => [...prevFiles, ...files]);
                  }}
                >
                  <Button
                    className="border border-gray-300 rounded h-800 w-800"
                    aria-label="Add image"
                  >
                    <ImageAdd />
                  </Button>
                </FileTrigger>
              )}
            </div>
          </div>

          <SpectrumButton
            variant="cta"
            type="submit"
            isPending={isGenerating}
            isDisabled={value === ""}
          >
            Generate
          </SpectrumButton>
        </div>
      </Group>
    </form>
  );
}
