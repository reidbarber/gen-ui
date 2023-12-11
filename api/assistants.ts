import { AssistantsPage } from "../data/types";

export async function listAssistants(): Promise<AssistantsPage> {
  return fetch("api/assistants", {
    method: "GET",
  }).then((res) => res.json());
}
