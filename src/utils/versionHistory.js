const VERSIONS_STORAGE_KEY = "docusphere_versions_v3";

export function getDocVersions(docId) {
  try {
    const data = localStorage.getItem(VERSIONS_STORAGE_KEY);
    if (!data) return [];
    const all = JSON.parse(data);
    return all[docId] || [];
  } catch (err) {
    return [];
  }
}

export function saveDocVersion(docId, title, content, updatedBy = "System") {
  try {
    const data = localStorage.getItem(VERSIONS_STORAGE_KEY);
    const all = data ? JSON.parse(data) : {};
    const existing = all[docId] || [];

    const newVersion = {
      versionId: `v_${Date.now()}`,
      timestamp: new Date().toISOString(),
      updatedBy,
      title,
      content
    };

    all[docId] = [newVersion, ...existing].slice(0, 10); // Keep last 10 revisions
    localStorage.setItem(VERSIONS_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error("Failed to save version history", err);
  }
}
