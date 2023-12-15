import {
  AlertDialog,
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Form,
  Heading,
  Item,
  Key,
  Picker,
  TextArea,
  TextField,
} from "@adobe/react-spectrum";
import { Model } from "openai/resources";
import { FormEvent, useRef, useState } from "react";
import { createAssistant, updateAssistant } from "../api/assistants";
import { instructions as defaultInstructions, tools } from "../data/assistants";
import { Assistant } from "../data/types";

export function CreateOrEditAssistantDialog({
  models,
  setSelectShowSelectAssistantDialog,
  setCreateShowSelectAssistantDialog,
  editingAssistant,
  setEditingAssistant,
  refreshAssistants,
}: {
  models: Model[];
  setSelectShowSelectAssistantDialog: (value: boolean) => void;
  setCreateShowSelectAssistantDialog: (value: boolean) => void;
  editingAssistant?: Assistant;
  setEditingAssistant: (value: Assistant | null) => void;
  refreshAssistants: () => Promise<void>;
}) {
  let [name, setName] = useState<string>(editingAssistant?.name || "");
  let [description, setDescription] = useState<string>(
    editingAssistant?.description || ""
  );
  let [instructions, setInstructions] = useState<string>(
    editingAssistant?.instructions || defaultInstructions
  );
  let [selectedModel, setSelectedModel] = useState<Key>(
    editingAssistant?.model || "gpt-4-1106-preview"
  );
  let [isCreating, setIsCreating] = useState<boolean>(false);

  let onSubmit = async (event: FormEvent) => {
    setIsCreating(true);
    event.preventDefault();
    if (editingAssistant !== null) {
      await updateAssistant(editingAssistant.id, {
        name,
        description,
        instructions,
        model: selectedModel.toString(),
        tools,
      });
    } else {
      await createAssistant({
        name,
        description,
        instructions,
        model: selectedModel.toString(),
        tools,
      });
    }
    await refreshAssistants();
    setIsCreating(false);
    setEditingAssistant(null);
    setCreateShowSelectAssistantDialog(false);
    setSelectShowSelectAssistantDialog(true);
  };

  let formSubmitRef = useRef<HTMLButtonElement>(null);

  let hasPendingChanges =
    editingAssistant?.name !== name ||
    editingAssistant?.description !== description ||
    editingAssistant?.instructions !== instructions ||
    editingAssistant?.model !== selectedModel;

  return (
    <Dialog>
      <Heading>
        {editingAssistant !== null ? "Edit Assistant" : "Create an Assistant"}
      </Heading>
      <Divider />
      <Content>
        <Form onSubmit={onSubmit} maxWidth="size-6000" margin="auto">
          <TextField
            label="Name"
            isRequired
            maxLength={256}
            value={name}
            onChange={setName}
          />
          <TextArea
            label="Description"
            value={description}
            onChange={setDescription}
          />
          <TextArea
            label="Instructions"
            isRequired
            value={instructions}
            onChange={setInstructions}
            height="300px"
          />
          <Picker
            label="Model"
            items={models || []}
            onSelectionChange={setSelectedModel}
            selectedKey={selectedModel}
            isRequired
            name="model"
          >
            {(item) => <Item>{item.id}</Item>}
          </Picker>
          <button
            type="submit"
            ref={formSubmitRef}
            className="hidden"
            aria-hidden="true"
          />
        </Form>
      </Content>
      <ButtonGroup>
        {editingAssistant !== null && hasPendingChanges && (
          <DialogTrigger>
            <Button variant="secondary">Cancel</Button>
            <AlertDialog
              variant="destructive"
              title="Save your changes?"
              primaryActionLabel="Discard changes"
              cancelLabel="Continue editing"
              onPrimaryAction={() => {
                setCreateShowSelectAssistantDialog(false);
                setSelectShowSelectAssistantDialog(true);
                setEditingAssistant(null);
              }}
            >
              Are you sure you want to discard your changes?
            </AlertDialog>
          </DialogTrigger>
        )}
        {editingAssistant !== null && !hasPendingChanges && (
          <Button
            onPress={() => {
              setCreateShowSelectAssistantDialog(false);
              setSelectShowSelectAssistantDialog(true);
              setEditingAssistant(null);
            }}
            variant="secondary"
          >
            Cancel
          </Button>
        )}
        {editingAssistant == null && (
          <Button
            variant="secondary"
            onPress={() => {
              setCreateShowSelectAssistantDialog(false);
              setSelectShowSelectAssistantDialog(true);
              setEditingAssistant(null);
            }}
          >
            Back
          </Button>
        )}
        <Button
          variant="accent"
          onPress={() => {
            formSubmitRef.current.click();
            setEditingAssistant(null);
          }}
          isPending={isCreating}
        >
          {editingAssistant !== null ? "Save" : "Create"}
        </Button>
      </ButtonGroup>
    </Dialog>
  );
}
