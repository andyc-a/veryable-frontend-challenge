"use client";
import { SearchBar } from "@/components/SearchBar";
import { useOps } from "@/hooks/useOps";
import { Operator } from "@/types/ops";
import { CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const { ops, loading, error } = useOps();

  const [checkins, setCheckins] = useState<Record<string, boolean>>({});

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "ops" | "reliability">("name");

  useEffect(() => {
    const stored = localStorage.getItem("checkins");
    if (stored) setCheckins(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("checkins", JSON.stringify(checkins));
  }, [checkins]);

  const toggleCheckin = (id: string) => {
    setCheckins((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredOps = ops.filter((op) => {
    const q = search.toLowerCase();
    if (!q) return op;

    return (
      op.opTitle?.toLowerCase().includes(q) ||
      op.publicId?.toLowerCase().includes(q) ||
      op.operators?.some((operator) => {
        return (
          operator.firstName?.toLowerCase().includes(q) ||
          operator.lastName?.toLowerCase().includes(q)
        );
      })
    );
  });

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
      <div style={{ marginBottom: 16 }}>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Sort by:</label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          style={{ padding: 6 }}
        >
          <option value="name">First & Last Name</option>
          <option value="ops">Ops Completed</option>
          <option value="reliability">Reliability</option>
        </select>
      </div>

      {filteredOps.length === 0 && <div>No results found</div>}
      {filteredOps.map((op) => (
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

            {op.operators
              ?.sort((a, b) => {
                if (sortBy === "name") {
                  const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                  const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                  return nameA.localeCompare(nameB);
                }

                if (sortBy === "ops") {
                  return b.opsCompleted - a.opsCompleted;
                }

                if (sortBy === "reliability") {
                  return b.reliability - a.reliability;
                }

                return 0;
              })
              .map((operator: Operator) => {
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
