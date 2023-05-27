const fs = require("fs");
const path = require("path");
const https = require("https");

async function checkRepo() {
  const localRepoPath = path.join(".data", "react-spectrum");
  if (!fs.existsSync(localRepoPath)) {
    return "missing";
  }

  const gitHubApiUrl =
    "https://api.github.com/repos/adobe/react-spectrum/commits/main";
  const gitHubOptions = {
    headers: { "User-Agent": "Node.js" },
  };

  const latestCommitHash = await new Promise((resolve) => {
    https.get(gitHubApiUrl, gitHubOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data).sha));
    });
  });

  const localCommitHash = fs.readFileSync(
    path.join(localRepoPath, ".git", "refs", "heads", "main"),
    "utf8"
  ).trim();

  return latestCommitHash === localCommitHash ? "up-to-date" : "outdated";
}