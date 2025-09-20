import { jwtDecode } from 'jwt-decode';

export function isAuthenticated() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return false;
    if (exp < Date.now() / 1000) {
      // Token has expired
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem("token");
    return false;
  }
}
