import OpenAI from "openai";

export interface Run extends OpenAI.Beta.Threads.Runs.Run {}

export interface RunUpdateParams extends OpenAI.Beta.Threads.RunUpdateParams {}

export interface RunListParams extends OpenAI.Beta.Threads.RunListParams {}

export interface RunCreateParams extends OpenAI.Beta.Threads.RunCreateParams {}

export interface RunsPage extends OpenAI.Beta.Threads.RunsPage {}

export interface Thread extends OpenAI.Beta.Thread {}

export interface ThreadUpdateParams extends OpenAI.Beta.ThreadUpdateParams {}

export interface ThreadCreateParams extends OpenAI.Beta.ThreadCreateParams {}

export interface ThreadDeleted extends OpenAI.Beta.Threads.ThreadDeleted {}

export interface ThreadCreateAndRunParams
  extends OpenAI.Beta.ThreadCreateAndRunParams {}

export interface ThreadMessage extends OpenAI.Beta.Threads.ThreadMessage {}

export interface MessageCreateParams
  extends OpenAI.Beta.Threads.MessageCreateParams {}

export interface Files extends OpenAI.Beta.Threads.Messages.Files {}

export interface MessageFile extends OpenAI.Beta.Threads.Messages.MessageFile {}

export interface FileListParams
  extends OpenAI.Beta.Threads.Messages.FileListParams {}

export interface MessageFilesPage
  extends OpenAI.Beta.Threads.Messages.MessageFilesPage {}

export interface RunStep extends OpenAI.Beta.Threads.Runs.RunStep {}

export interface RunStepsPage extends OpenAI.Beta.Threads.Runs.RunStepsPage {}

export interface Steps extends OpenAI.Beta.Threads.Runs.Steps {}

export interface StepListParams
  extends OpenAI.Beta.Threads.Runs.StepListParams {}

export interface RunSubmitToolOutputsParams
  extends OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams {}
