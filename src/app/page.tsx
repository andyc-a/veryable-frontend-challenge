"use client";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export interface Operator {
  id: number;
  firstName: string;
  lastName: string;
  opsCompleted: number;
  reliability: number;
  endorsements: string[];
}

export interface Op {
  opId: number;
  publicId: string;
  opTitle: string;
  opDate: string;
  filledQuantity: number;
  operatorsNeeded: number;
  startTime: string;
  endTime: string;
  estTotalHours: number;
  checkInCode: string;
  checkOutCode: string;
  checkInExpirationTime: string;
  checkOutExpirationTime: string;
  operators: Operator[];
}

export default function Home() {
  const [ops, setOps] = useState<Op[]>([]);
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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 3 }}>
        <Typography color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      {ops.map((op) => (
        <div
          key={op.opId}
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: "bold" }}>{op.opTitle}</div>
          <div>Public ID: {op.publicId}</div>
          <div>Operators Needed: {op.operatorsNeeded}</div>
          <div>
            {new Date(op.startTime).toLocaleString()} -{" "}
            {new Date(op.endTime).toLocaleString()}
          </div>

          <div style={{ marginTop: 12 }}>
            {op.operators?.length === 0 && <div>No operators</div>}

            {op.operators?.map((operator: Operator) => {
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
                    {operator.firstName} {operator.lastName}
                  </div>

                  <div>Ops: {operator.opsCompleted}</div>

                  <div>Reliability: {operator.reliability}%</div>

                  <div>Endorsements: {operator.endorsements}</div>

                  <button
                    onClick={() => toggleCheckin(`${operator.id}`)}
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
