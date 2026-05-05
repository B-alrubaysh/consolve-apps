// Role-based access control helpers — used ONLY inside admin pages.
// Public routes must never import from this file.

export const ROLES = {
  OWNER: "owner",
  ADMIN: "admin",
  WRITER: "writer",
  HR: "hr",
};

export const ALL_ADMIN_ROLES = [ROLES.OWNER, ROLES.ADMIN, ROLES.WRITER, ROLES.HR];

/**
 * requireRole(user, ...allowedRoles)
 * Returns true if the user's role is in the allowed list.
 * Use it inside admin pages to short-circuit and render <AccessDenied />.
 */
export function requireRole(user, ...allowedRoles) {
  if (!user || !user.role) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Sidebar visibility map by role.
 * writer: Blog + Templates only.
 * hr: Careers + Submissions only.
 * owner/admin: everything.
 */
export const SIDEBAR_VISIBILITY = {
  [ROLES.OWNER]: ["dashboard", "blog", "templates", "clients", "careers", "submissions", "assessments", "users", "settings"],
  [ROLES.ADMIN]: ["dashboard", "blog", "templates", "clients", "careers", "submissions", "assessments", "users", "settings"],
  [ROLES.WRITER]: ["blog", "templates"],
  [ROLES.HR]: ["careers", "submissions"],
};

export function canSeeNavItem(role, key) {
  const items = SIDEBAR_VISIBILITY[role] || [];
  return items.includes(key);
}