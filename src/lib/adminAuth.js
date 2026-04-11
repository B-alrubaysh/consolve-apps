const STORAGE_KEY = "consolve_admin_session";

export function getAdminSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAdminSession(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAdminUser() {
  const session = getAdminSession();
  return session?.user || null;
}

export function getAdminToken() {
  const session = getAdminSession();
  return session?.token || null;
}

// Role hierarchy helpers
const ROLE_LEVELS = {
  owner: 4,
  admin: 3,
  cms_manager: 2,
  hr: 1,
};

export function getRoleLevel(role) {
  return ROLE_LEVELS[role] || 0;
}

export function canAccessModule(role, module) {
  const access = {
    dashboard: ["owner", "admin", "cms_manager", "hr"],
    cms: ["owner", "admin", "cms_manager"],
    clients: ["owner", "admin"],
    forms: ["owner", "admin"],
    careers: ["owner", "admin", "hr"],
    logs: ["owner", "admin"],
    users: ["owner", "admin"],
    settings: ["owner", "admin"],
  };
  return access[module]?.includes(role) || false;
}

export const ROLE_LABELS = {
  owner: "Owner",
  admin: "Admin",
  cms_manager: "CMS Manager",
  hr: "HR",
};