import { ModelsPage } from "openai/resources";

export async function listModels(): Promise<ModelsPage> {
  return fetch("api/models", {
    method: "GET",
  }).then((res) => res.json());
}
