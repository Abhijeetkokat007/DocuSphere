export async function fetchGitHubRepoReadme(repoInput) {
  if (!repoInput) throw new Error("Please enter a GitHub repository (e.g. facebook/react)");

  let repoPath = repoInput.trim();
  // Clean up URL if full GitHub URL provided
  repoPath = repoPath.replace("https://github.com/", "").replace("http://github.com/", "").replace(/\/$/, "");

  // Default to main or master branch
  const rawUrl = `https://raw.githubusercontent.com/${repoPath}/main/README.md`;
  
  try {
    let response = await fetch(rawUrl);
    
    // Fallback to master if main branch 404s
    if (!response.ok) {
      const fallbackUrl = `https://raw.githubusercontent.com/${repoPath}/master/README.md`;
      response = await fetch(fallbackUrl);
    }

    if (!response.ok) {
      throw new Error(`Could not find README.md in repository '${repoPath}'. Please verify repository name.`);
    }

    const content = await response.text();
    const parts = repoPath.split('/');
    const repoName = parts[parts.length - 1] || repoPath;

    return {
      title: `${repoName} (GitHub Sync)`,
      filename: `README_${repoName}.md`,
      category: "GitHub Repos",
      tags: ["GitHub", "Sync", repoName],
      githubRepo: repoPath,
      lastSyncedAt: new Date().toISOString(),
      content
    };
  } catch (err) {
    throw new Error(err.message || "Failed to fetch GitHub README");
  }
}
