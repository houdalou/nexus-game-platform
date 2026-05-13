export default function LoadingSpinner({ size = 36, color = "var(--pink)" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
      <div
        style={{
          width: size,
          height: size,
          border: `2px solid var(--border-dim)`,
          borderTopColor: color,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
    </div>
  );
}
