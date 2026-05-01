export function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search ops..."
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #ccc",
        borderRadius: 6,
        marginBottom: 16,
      }}
    />
  );
}
