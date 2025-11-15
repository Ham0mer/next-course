export const VERSION = "2.0";

export const HISTORY_LIMIT: number = intEnv("NEXT_PUBLIC_HISTORY_LIMIT", -1);

// 课程查询 API 基础 URL
export const COURSE_API_BASE_URL: string = strEnv("COURSE_API_BASE_URL", "https://caowk.com");

// The maximum number of history items to keep in the local storage

function intEnv(name: string, defaultValue: number): number {
  const value = process.env[name];
  if (!value) return defaultValue;

  const parsed = parseInt(value);
  if (isNaN(parsed)) return defaultValue;

  return parsed;
}

export function strEnv(name: string, defaultValue?: string): string {
  return process.env[name] || defaultValue || "";
}
