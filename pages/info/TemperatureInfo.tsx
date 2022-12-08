import {
  ContextualHelp,
  Heading,
  Content,
  Text,
  Footer,
  Link,
} from "@adobe/react-spectrum";
import React from "react";

export function TemperatureInfo(): JSX.Element {
  return (
    <ContextualHelp variant="help" marginStart="size-100">
      <Heading>What is temperature?</Heading>
      <Content>
        <Text>
          What sampling temperature to use. Higher values means the model will
          take more risks. Try 0.9 for more creative applications, and 0 (argmax
          sampling) for ones with a well-defined answer.
        </Text>
      </Content>
      <Footer>
        <Link>
            <a
              href="https://beta.openai.com/docs/api-reference/completions/create#completions/create-temperature"
              target="_blank"
            >
              Learn more about temperature
            </a>
        </Link>
      </Footer>
    </ContextualHelp>
  );
}
