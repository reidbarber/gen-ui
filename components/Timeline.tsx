import { Item, StepList } from "@react-spectrum/steplist";

export function Timeline({
  messages,
  selectedMessageId,
  setSelectedMessageId,
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
      </div>
    </div>
  );
}
