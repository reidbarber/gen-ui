import { ProgressCircle } from "@adobe/react-spectrum";
import { Item, StepList } from "@react-spectrum/steplist";

export function Timeline({
  messages,
  selectedMessageId,
  setSelectedMessageId,
  isGenerating,
}) {
  return (
    <div className="w-3000 h-full pt-[45px] px-150">
      <h2 className="p-150">Timeline</h2>
      {messages.length <= 0 && (
        <div className="p-150">No prompts have been sent yet.</div>
      )}
      <div className="m-auto pt-75">
        {messages.length > 0 && (
          <StepList
            orientation="vertical"
            isEmphasized
            lastCompletedStep={messages[messages.length - 1].id}
            selectedKey={selectedMessageId}
            onSelectionChange={setSelectedMessageId}
          >
            {messages.map((message) => (
              <Item key={message.id}>
                {message.content
                  .map((content) =>
                    content.type === "text"
                      ? content.text.value
                      : `Message ${message.id}`
                  )
                  .join(" ")}
              </Item>
            ))}
          </StepList>
        )}
        {isGenerating && (
          <div className="flex justify-center p-150">
            <ProgressCircle
              aria-label="Generating..."
              UNSAFE_style={{ display: "block" }}
              isIndeterminate
            />
          </div>
        )}
      </div>
    </div>
  );
}
