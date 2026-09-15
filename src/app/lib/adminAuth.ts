const SESSION_KEY = 'bismark_admin_unlocked';
const DEFAULT_PASSCODE = 'bismark123';

export function getAdminPasscode(): string {
  const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
  return env.VITE_ADMIN_PASSCODE || DEFAULT_PASSCODE;
}

export function isAdminUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function tryAdminLogin(passcode: string): boolean {
  const ok = passcode === getAdminPasscode();
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
