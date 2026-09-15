const SESSION_KEY = 'bismark_admin_unlocked';
const USER_KEY = 'bismark_admin_username';
const PASS_KEY = 'bismark_admin_password';
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin';

export function getAdminUsername(): string {
  try {
    const override = localStorage.getItem(USER_KEY);
    if (override) return override;
  } catch {
    // ignore
  }
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  return env.VITE_ADMIN_USERNAME || DEFAULT_USERNAME;
}

export function getAdminPassword(): string {
  try {
    const override = localStorage.getItem(PASS_KEY);
    if (override) return override;
  } catch {
    // ignore
  }
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  return env.VITE_ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

export function updateAdminCredentials(username: string, password: string): void {
  try {
    localStorage.setItem(USER_KEY, username);
    localStorage.setItem(PASS_KEY, password);
  } catch {
    // ignore
  }
}

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function tryAdminLogin(username: string, password: string): boolean {
  const ok = username === getAdminUsername() && password === getAdminPassword();
  try {
    if (ok) sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    // ignore
  }
  return ok;
}

export function lockAdmin() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
