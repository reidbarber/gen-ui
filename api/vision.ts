import { ChatCompletion } from "openai/resources";

const headers = {
  "Content-Type": "application/json",
};

let blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export async function getImagesDescription(body: {
  images: File[];
}): Promise<ChatCompletion> {
  const base64Images = await Promise.all(
    body.images.map((blob) => blobToBase64(blob))
  );
  return fetch("api/vision", {
    method: "POST",
    headers,
    body: JSON.stringify({ images: base64Images }),
  }).then((res) => res.json());
}
