import { useAuthStore } from "@/store/auth-store";

export const usePermission = () => {
  const user = useAuthStore((state) => state.user);

  /**
   * Check if user has a specific permission.
   * Admin bypasses all checks.
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.roles?.includes("Admin")) return true;
    return user.permissions?.includes(permission) ?? false;
  };

  /**
   * Check if user has any of the given permissions.
   * Admin bypasses all checks.
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    if (user.roles?.includes("Admin")) return true;
    return permissions.some((perm) => user.permissions?.includes(perm));
  };

  /**
   * Check if user has a specific role.
   */
  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles?.includes(role) ?? false;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasRole,
    user,
  };
};
