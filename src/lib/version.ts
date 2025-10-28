// Centralized application version for the frontend. If Vite env var is present, use it; else fallback.
export const APP_VERSION = (import.meta as any)?.env?.['VITE_APP_VERSION'] ?? '1.2.0';


