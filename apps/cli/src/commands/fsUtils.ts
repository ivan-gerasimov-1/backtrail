export function isErrnoException(
  error: unknown,
): error is Error & { code: string } {
  return error instanceof Error && "code" in error;
}

export async function tryCreate<T>(
  attempt: () => Promise<T>,
  fallback: () => Promise<T>,
): Promise<T> {
  try {
    let result = await attempt();
    return result;
  } catch (error: unknown) {
    if (isErrnoException(error) && error.code === "ENOENT") {
      return fallback();
    }
    throw error;
  }
}
