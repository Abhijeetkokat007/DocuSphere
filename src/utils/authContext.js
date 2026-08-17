// Multi-Tenant Auth & Backend REST API Connector (Port 8055)

const API_BASE = 'http://localhost:8055/api';

export const DEMO_ORGS = {
  "org_celesta": {
    id: "org_celesta",
    name: "Celesta Healthcare",
    logo: "🏥",
    industry: "Healthcare & Medical Devices",
    membersCount: 8
  },
  "org_abtech": {
    id: "org_abtech",
    name: "AB Technology",
    logo: "💻",
    industry: "Software & Cloud Engineering",
    membersCount: 14
  }
};

export const DEMO_USERS = [
  {
    id: "usr_celesta_admin",
    name: "Dr. Vikram Sharma",
    email: "vikram@celesta.health",
    role: "Admin",
    title: "Chief Technology Officer",
    avatar: "👨‍⚕️",
    bio: "Leading medical software integration & printer setups at Celesta Healthcare.",
    orgId: "org_celesta"
  },
  {
    id: "usr_abtech_admin",
    name: "Arjun Mehta",
    email: "arjun@abtechnology.com",
    role: "Admin",
    title: "Principal Architect",
    avatar: "👨‍💻",
    bio: "Building microservices & developer frameworks at AB Technology.",
    orgId: "org_abtech"
  }
];

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'ok';
  } catch (err) {
    return false;
  }
}

export async function getAuthSessionAsync() {
  try {
    const res = await fetch(`${API_BASE}/session`);
    if (res.ok) {
      const session = await res.json();
      if (session?.user && session?.org) return session;
    }
  } catch (err) {
    console.warn("Backend API port 8055 offline, using local session fallback");
  }
  return { user: DEMO_USERS[0], org: DEMO_ORGS["org_celesta"] };
}

export async function setAuthSessionAsync(user, org) {
  try {
    const res = await fetch(`${API_BASE}/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, org })
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend API port 8055 offline, falling back to local state");
  }
  return { user, org };
}

export async function getOrgDocsAsync(orgId) {
  try {
    const res = await fetch(`${API_BASE}/orgs/${orgId}/docs`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Backend API port 8055 offline, using local docs fallback for org ${orgId}`);
  }
  return [];
}

export async function saveOrgDocAsync(orgId, doc) {
  try {
    const res = await fetch(`${API_BASE}/orgs/${orgId}/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc)
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Backend API port 8055 offline, using local fallback");
  }
}

export async function deleteOrgDocAsync(orgId, docId) {
  try {
    await fetch(`${API_BASE}/orgs/${orgId}/docs/${docId}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn("Backend API port 8055 offline");
  }
}
