import { FileListParams, MessageFile, MessageFilesPage } from "../data/types";

const headers = {
  "Content-Type": "application/json",
};

export async function getFile(
  thread_id: string,
  message_id: string,
  file_id: string
): Promise<MessageFile> {
  return fetch(
    `api/threads/${thread_id}/messages/${message_id}/files/${file_id}`,
    {
      method: "GET",
      headers,
    }
  ).then((res) => res.json());
}

export async function listFiles(
  thread_id: string,
  message_id: string,
  query?: FileListParams
): Promise<MessageFilesPage> {
  return fetch(
    `api/threads/${thread_id}/messages/${message_id}/files?${query}`,
    {
      method: "GET",
      headers,
    }
  ).then((res) => res.json());
}
