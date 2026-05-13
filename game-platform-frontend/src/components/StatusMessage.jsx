export default function StatusMessage({ status }) {
  if (!status) return null;
  const isOk = status.type === "success";
  return (
    <div
      style={{
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 12,
        marginBottom: 14,
        background: isOk ? "rgba(0,255,157,0.06)" : "rgba(255,43,214,0.06)",
        border: `1px solid ${isOk ? "rgba(0,255,157,0.2)" : "rgba(255,43,214,0.2)"}`,
        color: isOk ? "var(--green)" : "var(--pink)",
      }}
    >
      {status.message}
    </div>
  );
}
