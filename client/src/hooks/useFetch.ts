import { useEffect, useState } from "react";

export function useFetch<T>(
  url: string,
  parser: "json" | "blob" | "text"
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}`);
        }
        if (parser === "json") {
          return response.json();
        }
        if (parser === "blob") {
          return response.blob();
        }
        return response.text();
      })
      .then((response) => setData(response))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url, parser]);

  return { data, loading, error };
}
