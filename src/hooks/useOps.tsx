import { useEffect, useState } from "react";
import { Op } from "../types/ops";

export function useOps() {
  const [ops, setOps] = useState<Op[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://frontend-challenge.veryableops.com/")
      .then((res) => res.json())
      .then((data) => setOps(data))
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, []);

  return { ops, loading, error };
}
