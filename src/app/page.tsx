"use client";
import { SearchBar } from "@/components/SearchBar";
import { useOps } from "@/hooks/useOps";
import { Operator } from "@/types/ops";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Home() {
  const { ops, loading, error } = useOps();

  const [checkins, setCheckins] = useState<Record<string, boolean>>({});

  // todo: for larger dataset, debounce search
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

  // todo: this could be memoize for larger complex data
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
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <SearchBar value={search} onChange={setSearch} />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Sort by:
        </Typography>

        <Select
          size="small"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          sx={{ backgroundColor: "white" }}
        >
          <MenuItem value="name">First & Last Name</MenuItem>
          <MenuItem value="ops">Ops Completed</MenuItem>
          <MenuItem value="reliability">Reliability</MenuItem>
        </Select>
      </Box>

      {filteredOps.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No results found
        </Typography>
      )}

      {filteredOps.map((op) => (
        <Box
          key={op.opId}
          sx={{
            mb: 2,
            p: 2,
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            {op.opTitle}
          </Typography>

          <Typography variant="body2" color="primary">
            Public ID: {op.publicId}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Operators Needed: {op.operatorsNeeded}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {new Date(op.startTime).toLocaleString()} →{" "}
            {new Date(op.endTime).toLocaleString()}
          </Typography>

          <Box sx={{ mt: 2, overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Ops</TableCell>
                  <TableCell>Reliability</TableCell>
                  <TableCell>Endorsements</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {op.operators
                  ?.sort((a, b) => {
                    if (sortBy === "name") {
                      return `${a.firstName} ${a.lastName}`.localeCompare(
                        `${b.firstName} ${b.lastName}`,
                      );
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
                      <TableRow key={operator.id}>
                        <TableCell>
                          {operator.firstName} {operator.lastName}
                        </TableCell>

                        <TableCell>{operator.opsCompleted}</TableCell>

                        <TableCell>
                          <Typography
                            sx={{
                              color:
                                operator.reliability > 0.85
                                  ? "success.main"
                                  : "warning.main",
                              fontWeight: 500,
                            }}
                          >
                            {Math.round(operator.reliability * 100)}%
                          </Typography>
                        </TableCell>

                        <TableCell>
                          {operator.endorsements.join(", ")}
                        </TableCell>

                        <TableCell>
                          <Button
                            size="small"
                            variant={isCheckedIn ? "outlined" : "contained"}
                            onClick={() => toggleCheckin(String(operator.id))}
                          >
                            {isCheckedIn ? "Check Out" : "Check In"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
