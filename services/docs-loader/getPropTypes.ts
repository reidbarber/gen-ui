const fs = require("fs");
const path = require("path");
const { parse } = require("react-docgen-typescript");

function getPropTypes(componentName) {
  const localRepoPath = path.join(".data", `react-spectrum`);
  const componentPackage = componentName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  const componentPath = path.join(localRepoPath, "packages", "@react-spectrum", componentPackage, "src", `${componentName}.tsx`);

  const componentSource = fs.readFileSync(componentPath, "utf8");
  const componentInfo = parse(componentSource);

  const propTable = `| Prop Name | Type | Default | Description |\n| --- | --- | --- | --- |\n`;
  const propRows = Object.entries(componentInfo.props).map(([propName, propInfo]) => {
    const type = propInfo.type.name;
    const defaultValue = propInfo.defaultValue ? propInfo.defaultValue.value : "";
    const description = propInfo.description;
    return `| ${propName} | ${type} | ${defaultValue} | ${description} |`;
  });
  return propTable + propRows.join("\n") + "\n";
}