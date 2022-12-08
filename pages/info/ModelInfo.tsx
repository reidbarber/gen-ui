import {
  ContextualHelp,
  Heading,
  Content,
  Text,
  Footer,
  Link,
} from "@adobe/react-spectrum";
import React from "react";

export function ModelInfo(): JSX.Element {
  return (
    <ContextualHelp variant="help" marginStart="size-100">
      <Heading>About models</Heading>
      <Content>
        <Text>
          GPT-3 models can understand and generate natural language. Codex models are descendants of GPT-3 that have been trained on both natural language and billions of lines of code.
        </Text>
      </Content>
      <Footer>
        <Link>
            <a
              href="https://beta.openai.com/docs/models/overview"
              target="_blank"
            >
              Learn more about models
            </a>
        </Link>
      </Footer>
    </ContextualHelp>
  );
}
