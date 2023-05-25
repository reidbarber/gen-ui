function getDocsPath(componentName) {
  return path.join(
    ".data",
    "react-spectrum",
    "packages",
    "react-spectrum",
    componentName,
    "docs",
    `${componentName}.mdx`
  );
}
