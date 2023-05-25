async function getExample(componentName) {
  await getRepo();
  const docsPath = getDocsPath(componentName);
  const fileContents = fs.readFileSync(docsPath, "utf-8");
  const exampleSection = fileContents.match(/# Example([\s\S]*?)```/);
  return exampleSection ? exampleSection[1].trim() : "Example not found";
}
