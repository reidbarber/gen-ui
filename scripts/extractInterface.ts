import * as ts from "typescript";

function extractInterface(sourceCode: string, interfaceName: string): string {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    sourceCode,
    ts.ScriptTarget.Latest,
    true
  );

  function findInterface(
    node: ts.Node,
    name: string
  ): ts.InterfaceDeclaration | undefined {
    if (ts.isInterfaceDeclaration(node) && node.name.text === name) {
      return node;
    }

    return ts.forEachChild(node, (child) => findInterface(child, name));
  }

  const interfaceNode = findInterface(sourceFile, interfaceName);
  if (!interfaceNode) {
    throw new Error(`Interface "${interfaceName}" not found.`);
  }

  function interfaceToString(node: ts.InterfaceDeclaration): string {
    let result = "interface " + node.name.text + " {\n";

    ts.forEachChild(node, (child) => {
      if (ts.isPropertySignature(child)) {
        const propertyName = child.name.getText(sourceFile);
        const propertyType = child.type
          ? child.type.getText(sourceFile)
          : "any";
        const isOptional = child.questionToken ? "?" : "";
        result += `  ${propertyName}${isOptional}: ${propertyType};\n`;
      }
    });

    result += "}";
    return result;
  }

  return interfaceToString(interfaceNode);
}
