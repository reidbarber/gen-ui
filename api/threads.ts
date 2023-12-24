import { Thread, ThreadCreateParams, ThreadUpdateParams } from "../data/types";
import { ToastQueue } from "@react-spectrum/toast";

const headers = {
  "Content-Type": "application/json",
};

export async function createThread(body: ThreadCreateParams): Promise<Thread> {
  return fetch("api/threads", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function getThread(thread_id: string): Promise<Thread> {
  return fetch(`api/threads/${thread_id}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function updateThread(
  thread_id: string,
  body: ThreadUpdateParams
): Promise<Thread> {
  return fetch(`api/threads/${thread_id}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function deleteThread(thread_id: string): Promise<Thread> {
  return fetch(`api/threads/${thread_id}`, {
    method: "DELETE",
    headers,
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}
