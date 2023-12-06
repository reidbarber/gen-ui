import {
  Run,
  RunListParams,
  RunSubmitToolOutputsParams,
  RunUpdateParams,
  RunsPage,
  ThreadCreateAndRunParams,
} from "../data/types";

export async function createRun(thread_id: string): Promise<Run> {
  return fetch(`threads/${thread_id}/runs`, {
    method: "POST",
  }).then((res) => res.json());
}

export async function getRun(thread_id: string, run_id: string): Promise<Run> {
  return fetch(`threads/${thread_id}/runs/${run_id}`, {
    method: "GET",
  }).then((res) => res.json());
}

export async function updateRun(
  thread_id: string,
  run_id: string,
  body: RunUpdateParams
): Promise<Run> {
  return fetch(`threads/${thread_id}/runs/${run_id}`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export async function listRuns(thread_id: string): Promise<RunsPage> {
  return fetch(`threads/${thread_id}/runs`, {
    method: "GET",
  }).then((res) => res.json());
}

export async function submitToolOutputs(
  thread_id: string,
  run_id: string,
  body: RunSubmitToolOutputsParams
): Promise<Run> {
  return fetch(`threads/${thread_id}/runs/${run_id}/submit_tool_outputs`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export async function cancelRun(
  thread_id: string,
  run_id: string
): Promise<Run> {
  return fetch(`threads/${thread_id}/runs/${run_id}/cancel`, {
    method: "POST",
  }).then((res) => res.json());
}

export async function createThreadAndRun(
  body: ThreadCreateAndRunParams
): Promise<Run> {
  return fetch(`threads/runs`, {
    method: "POST",
    body: JSON.stringify(body),
  }).then((res) => res.json());
}

export async function getRunStep(
  thread_id: string,
  run_id: string,
  step_id: string
): Promise<Run> {
  return fetch(`threads/${thread_id}/runs/${run_id}/steps/${step_id}`, {
    method: "GET",
  }).then((res) => res.json());
}

export async function listRunSteps(
  thread_id: string,
  run_id: string,
  query?: RunListParams
): Promise<Run> {
  return fetch(`threads/${thread_id}/runs/${run_id}/steps?${query}`, {
    method: "GET",
  }).then((res) => res.json());
}
