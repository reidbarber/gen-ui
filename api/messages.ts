import {
  MessageCreateParams,
  ThreadMessage,
  MessageListParams,
  ThreadMessagesPage,
  MessageUpdateParams,
} from "../data/types";
import { ToastQueue } from "@react-spectrum/toast";

const headers = {
  "Content-Type": "application/json",
};

export async function createMessage(
  thread_id: string,
  body: MessageCreateParams
): Promise<ThreadMessage> {
  return fetch(`api/threads/${thread_id}/messages`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function getMessage(
  thread_id: string,
  message_id: string
): Promise<ThreadMessage> {
  return fetch(`api/threads/${thread_id}/messages/${message_id}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function updateMessage(
  thread_id: string,
  message_id: string,
  body: MessageUpdateParams
): Promise<ThreadMessage> {
  return fetch(`api/threads/${thread_id}/messages/${message_id}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}

export async function listMessages(
  thread_id: string,
  query?: MessageListParams
): Promise<ThreadMessagesPage> {
  return fetch(`api/threads/${thread_id}/messages?${query}`, {
    method: "GET",
    headers,
  })
    .then((res) => res.json())
    .catch((err) => {
      ToastQueue.negative(err);
    });
}
