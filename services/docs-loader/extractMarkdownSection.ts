const marked = require("marked");

export function extractMarkdownSection(markdown, title) {
  const tokens = marked.lexer(markdown);

  let recording = false;
  let output = "";

  tokens.forEach((token) => {
    if (token.type === "heading" && token.text === title) {
      recording = true;
    } else if (token.type === "heading") {
      recording = false;
    }

    if (recording) {
      output += marked.parser([token]);
    }
  });

  return output;
}
