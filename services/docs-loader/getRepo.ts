async function getRepo() {
  const repoStatus = await checkRepo();
  const localRepoPath = path.join(".data", "react-spectrum");

  if (repoStatus === "missing") {
    execSync(
      `git clone https://github.com/adobe/react-spectrum.git ${localRepoPath}`
    );
  } else if (repoStatus === "outdated") {
    execSync("git pull", { cwd: localRepoPath });
  }
}
