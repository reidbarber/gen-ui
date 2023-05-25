/**
 * Extract exports into array (https://github.com/adobe/react-spectrum/blob/main/packages/%40adobe/react-spectrum/src/index.ts)
 */
function extractExports(input) {
  const exports = [];
  const lines = input.split("\n");

  lines.forEach((line) => {
    if (line.startsWith("export")) {
      const matches = line.match(/{([^}]+)}/);
      if (matches && matches[1]) {
        const items = matches[1].split(",").map((item) => item.trim());
        exports.push(...items);
      }
    }
  });

  return exports;
}
