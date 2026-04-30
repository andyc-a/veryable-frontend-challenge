"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [ops, setOps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkins, setCheckins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem("checkins");
    if (stored) setCheckins(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("checkins", JSON.stringify(checkins));
  }, [checkins]);

  useEffect(() => {
    fetch("https://frontend-challenge.veryableops.com/")
      .then((res) => res.json())
      .then((data) => setOps(data))
      .catch(() => setError("Failed to fetch data"))
      .finally(() => setLoading(false));
  }, []);

  const toggleCheckin = (id: string) => {
    setCheckins((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;

  return (
    <div style={{ padding: 20 }}>
      {ops.map((op) => (
        <div
          key={op.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: "bold" }}>{op.title}</div>
          <div>Public ID: {op.public_id}</div>
          <div>Operators Needed: {op.operators_needed}</div>
          <div>
            {new Date(op.start).toLocaleString()} -{" "}
            {new Date(op.end).toLocaleString()}
          </div>

          <div style={{ marginTop: 12 }}>
            {op.operators?.length === 0 && <div>No operators</div>}

            {op.operators?.map((operator: any) => {
              const isCheckedIn = checkins[operator.id] || false;

              return (
                <div
                  key={operator.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    marginTop: 8,
                    padding: 8,
                    border: "1px solid #eee",
                    borderRadius: 6,
                  }}
                >
                  <div style={{ minWidth: 150 }}>
                    {operator.first_name} {operator.last_name}
                  </div>

                  <div>Ops: {operator.ops_completed}</div>

                  <div>Reliability: {operator.reliability}%</div>

                  <div>Endorsements: {operator.endorsements}</div>

                  <button
                    onClick={() => toggleCheckin(operator.id)}
                    style={{
                      marginLeft: "auto",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {isCheckedIn ? "Check Out" : "Check In"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
