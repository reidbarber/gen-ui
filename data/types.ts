import OpenAI from "openai";

export interface Run extends OpenAI.Beta.Threads.Runs.Run {}

export interface RunUpdateParams extends OpenAI.Beta.Threads.RunUpdateParams {}

export interface RunListParams extends OpenAI.Beta.Threads.RunListParams {}

export interface RunListParams extends OpenAI.Beta.Threads.RunListParams {}

export interface RunsPage extends OpenAI.Beta.Threads.RunsPage {}

export interface Thread extends OpenAI.Beta.Thread {}

export interface ThreadUpdateParams extends OpenAI.Beta.ThreadUpdateParams {}

export interface ThreadCreateParams extends OpenAI.Beta.ThreadCreateParams {}

export interface ThreadDeleted extends OpenAI.Beta.Threads.ThreadDeleted {}

export interface ThreadCreateAndRunParams
  extends OpenAI.Beta.ThreadCreateAndRunParams {}

export interface ThreadMessage extends OpenAI.Beta.Threads.ThreadMessage {}
