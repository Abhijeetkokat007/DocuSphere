// Multi-user authentication & workspace manager

export const DEFAULT_USERS = [
  {
    id: "usr_alex",
    name: "Alex Rivers",
    email: "alex@docusphere.dev",
    role: "Developer",
    avatar: "👨‍💻",
    workspace: "Personal Workspace"
  },
  {
    id: "usr_acme",
    name: "Acme Corp Team",
    email: "team@acme.io",
    role: "Organization",
    avatar: "🚀",
    workspace: "Acme Engineering Hub"
  },
  {
    id: "usr_sarah",
    name: "Sarah Chen",
    email: "sarah@devops.org",
    role: "DevOps Lead",
    avatar: "👩‍💻",
    workspace: "Infrastructure Docs"
  }
];

const CURRENT_USER_KEY = "docusphere_current_user_v2";
const VIEWS_ANALYTICS_KEY = "docusphere_analytics_v2";

export function getCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    if (!data) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_USERS[0]));
      return DEFAULT_USERS[0];
    }
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_USERS[0];
  }
}

export function setCurrentUser(user) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to set user", err);
  }
}

export function getDocumentAnalytics() {
  try {
    const data = localStorage.getItem(VIEWS_ANALYTICS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (err) {
    return {};
  }
}

export function recordDocumentView(docId) {
  try {
    const stats = getDocumentAnalytics();
    const current = stats[docId] || { views: 0, copies: 0, exports: 0, lastViewed: null };
    stats[docId] = {
      ...current,
      views: current.views + 1,
      lastViewed: new Date().toISOString()
    };
    localStorage.setItem(VIEWS_ANALYTICS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to record view", err);
  }
}

export function recordDocumentAction(docId, actionType = 'copies') {
  try {
    const stats = getDocumentAnalytics();
    const current = stats[docId] || { views: 1, copies: 0, exports: 0, lastViewed: new Date().toISOString() };
    stats[docId] = {
      ...current,
      [actionType]: (current[actionType] || 0) + 1
    };
    localStorage.setItem(VIEWS_ANALYTICS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to record action", err);
  }
}
