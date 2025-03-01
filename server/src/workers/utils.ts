export async function fetchJSON<T>(
  url: string,
  method: string = 'POST',
): Promise<T> {
  const response = await fetch(url, {
    method,
  });
  return response.json() as T;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
