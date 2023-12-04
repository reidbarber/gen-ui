import {
  ContextualHelp,
  Heading,
  Content,
  Text,
  Footer,
  Link,
} from "@adobe/react-spectrum";
import React from "react";

export function MaxTokensInfo(): JSX.Element {
  return (
    <ContextualHelp variant="help" marginStart="size-100">
      <Heading>About token maximums</Heading>
      <Content>
        <Text>The maximum number of tokens to generate in the completion.</Text>
      </Content>
      <Footer>
        <Link>
          <a
            href="https://beta.openai.com/docs/api-reference/completions/create#completions/create-max_tokens"
            target="_blank"
          >
            Read more
          </a>
        </Link>
      </Footer>
    </ContextualHelp>
  );
}
