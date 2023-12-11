import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Heading,
  Link,
  ProgressCircle,
} from "@adobe/react-spectrum";
import { Radio, RadioGroup } from "react-aria-components";

export function AssistantDialog({
  assistants,
  assistantSelectorValue,
  setAssistantSelectorValue,
  setShowAssistantDialog,
  setSelectedAssistantId,
}) {
  return (
    <Dialog>
      <Heading>Select an Assistant</Heading>
      <Divider />
      <Content>
        {assistants === null && (
          <ProgressCircle aria-label="Loading assistants" />
        )}
        {assistants?.length === 0 && "No assistants found."}
        {assistants?.length > 0 && (
          <RadioGroup
            className="flex items-center justify-center space-y-2 text-center"
            aria-label="Available assistants"
            value={assistantSelectorValue}
            onChange={setAssistantSelectorValue}
          >
            {assistants?.map((assistant) => (
              <Radio
                key={assistant.id}
                value={assistant.id}
                className="flex justify-center bg-white border rounded dark:bg-black p-160 m-160 h-1200 w-2000 focus:outline-none focus-visible:ring-half focus-visible:ring-offset-0 selected:bg-accent-100 selected:border-accent-700"
              >
                {({ isSelected }) => (
                  <div className="relative flex flex-col items-center justify-center w-full h-full gap-150">
                    {isSelected && (
                      <div className="absolute top-0 left-0 -mt-75 -ml-75">
                        <div className="h-[14px] w-[14px] bg-accent-900 rounded-small">
                          <svg
                            className="fill-gray-75 pt-[2px] pl-[2px] w-[14px] h-[14px]"
                            focusable="false"
                            aria-hidden="true"
                            role="img"
                          >
                            <path d="M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z"></path>
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="font-semibold">{assistant.name}</div>
                    {assistant.description && (
                      <div className="text-sm">{assistant.description}</div>
                    )}
                  </div>
                )}
              </Radio>
            ))}
          </RadioGroup>
        )}
        {assistants !== null && (
          <div className="text-center">
            {assistants?.length > 0 && <div>or</div>}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://platform.openai.com/assistants"
            >
              Create an assistant
              {/** TODO: Update to point to github */}
            </Link>
          </div>
        )}
      </Content>
      <ButtonGroup>
        <Button
          variant="accent"
          onPress={() => {
            setShowAssistantDialog(false);
            setSelectedAssistantId(assistantSelectorValue);
          }}
        >
          Start
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
