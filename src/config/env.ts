export const ENV = {
  API_URL: import.meta.env.VITE_API_URL as string,
  STATICS_URL: import.meta.env.VITE_PUBLIC_STATICS_URL as string,
  ENV: import.meta.env.VITE_PUBLIC_ENV as string,
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}
