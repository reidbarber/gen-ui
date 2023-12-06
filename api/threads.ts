import { Thread } from "../data/types";

const headers = {
  "Content-Type": "application/json",
};

export async function createThread(): Promise<Thread> {
  return fetch("api/threads", {
    method: "POST",
    headers,
  }).then((res) => res.json());
}

export async function getThread(thread_id: string): Promise<Thread> {
  return fetch(`api/threads/${thread_id}`, {
    method: "GET",
    headers,
  }).then((res) => res.json());
}

export async function updateThread(
  thread_id: string,
  body: any
): Promise<Thread> {
  return fetch(`api/threads/${thread_id}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export async function deleteThread(thread_id: string): Promise<Thread> {
  return fetch(`api/threads/${thread_id}`, {
    method: "DELETE",
    headers,
  }).then((res) => res.json());
}
