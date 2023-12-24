import { ModelsPage } from "openai/resources";
import { ToastQueue } from "@react-spectrum/toast";

export async function listModels(): Promise<ModelsPage> {
  return fetch("api/models", {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}
