import {
  ActionButton,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  Divider,
  Heading,
  Item,
  ListView,
  Text,
  ProgressCircle,
  ActionMenu,
} from "@adobe/react-spectrum";
import { Assistant } from "../data/types";
import Edit from "@spectrum-icons/workflow/Edit";
import Delete from "@spectrum-icons/workflow/Delete";
import { deleteAssistant } from "../api/assistants";
import { useAssistant } from "../context/AssistantContext";

export function SelectAssistantDialog() {
  let {
    assistants,
    assistantSelectorValue,
    setAssistantSelectorValue,
    setSelectedAssistantId,
    refreshAssistants,
    setEditingAssistant,
    setSelectShowSelectAssistantDialog,
    setCreateShowSelectAssistantDialog,
  } = useAssistant();

  return (
    <Dialog>
      <Heading>Select an Assistant</Heading>
      <Divider />
      <Content>
        {assistants === null && (
          <div className="flex justify-center">
            <ProgressCircle aria-label="Loading assistants" isIndeterminate />
          </div>
        )}
        <ListView
          isQuiet
          selectedKeys={[assistantSelectorValue]}
          onSelectionChange={(keys) => {
            setAssistantSelectorValue([...keys][0]);
          }}
          disallowEmptySelection
          items={(assistants as Assistant[]) || []}
          selectionMode="single"
          maxWidth="size-4600"
          aria-label="Assistants"
          marginX="auto"
          marginTop="size-300"
          marginBottom="size-150"
          renderEmptyState={() => (
            <div className="text-center">No assistants found.</div>
          )}
        >
          {(item) => (
            <Item textValue={item.name}>
              <Text>{item.name}</Text>
              {item.description && (
                <Text slot="description">{item.description}</Text>
              )}
              <ActionMenu
                onAction={async (key) => {
                  if (key === "edit") {
                    setSelectShowSelectAssistantDialog(false);
                    setCreateShowSelectAssistantDialog(true);
                    setEditingAssistant(item);
                  } else if (key === "delete") {
                    await deleteAssistant(item.id);
                    await refreshAssistants();
                  }
                }}
              >
                <Item key="edit" textValue="Edit">
                  <Edit />
                  <Text>Edit</Text>
                </Item>
                <Item key="delete" textValue="Delete">
                  <Delete />
                  <Text>Delete</Text>
                </Item>
              </ActionMenu>
            </Item>
          )}
        </ListView>
        {assistants !== null && (
          <div className="text-center">
            {assistants?.length > 0 && <div className="mb-50">or</div>}
            <ActionButton
              onPress={() => {
                setSelectShowSelectAssistantDialog(false);
                setCreateShowSelectAssistantDialog(true);
              }}
              isQuiet
            >
              Create an Assistant
            </ActionButton>
          </div>
        )}
      </Content>
      <ButtonGroup>
        <Button
          variant="accent"
          onPress={() => {
            setSelectShowSelectAssistantDialog(false);
            setSelectedAssistantId(assistantSelectorValue);
          }}
        >
          Start
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
