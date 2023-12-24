import {
  AssistantCreateParams,
  AssistantUpdateParams,
} from "openai/resources/beta/assistants/assistants";
import { Assistant, AssistantsPage } from "../data/types";
import { ToastQueue } from "@react-spectrum/toast";

export async function listAssistants(): Promise<AssistantsPage> {
  return fetch("api/assistants", {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function createAssistant(
  params: AssistantCreateParams
): Promise<Assistant> {
  return fetch("api/assistants", {
    method: "POST",
    body: JSON.stringify(params),
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function updateAssistant(
  assistant_id: string,
  body: AssistantUpdateParams
): Promise<Assistant> {
  return fetch(`api/assistants/${assistant_id}`, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function deleteAssistant(assistant_id: string): Promise<void> {
  return fetch(`api/assistants/${assistant_id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}
