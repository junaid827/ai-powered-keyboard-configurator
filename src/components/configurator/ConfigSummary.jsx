import { useConfigStore } from "../../store/configStore";

const CATEGORY_LABELS = {
  case: "Case",
  switches: "Switches",
  keycaps: "Keycaps",
  pcb: "PCB",
  plate: "Plate",
};

export default function ConfigSummary() {
  const { config, getTotalPrice, compatibility } = useConfigStore();
  const total = getTotalPrice();

  return (
    <div
      style={{
        padding: "16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Build breakdown */}
      <div style={{ marginBottom: 12 }}>
        {Object.entries(config).map(([category, part]) => (
          <div
            key={category}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 11,
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {CATEGORY_LABELS[category]}
              </span>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                {part?.name || "—"}
              </div>
            </div>
            <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
              ${part?.price || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0 0",
        }}
      >
        <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
          Total
        </span>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}>
          ${total}
        </span>
      </div>

      {/* Status */}
      <div
        style={{
          marginTop: 10,
          padding: "8px 12px",
          borderRadius: 8,
          background: compatibility?.isCompatible
            ? "rgba(34,197,94,0.08)"
            : "rgba(239,68,68,0.08)",
          border: `1px solid ${compatibility?.isCompatible ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
          fontSize: 12,
          color: compatibility?.isCompatible ? "#4ade80" : "#f87171",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span>{compatibility?.isCompatible ? "✓" : "✗"}</span>
        <span>
          {compatibility?.isCompatible
            ? "All parts compatible"
            : "Compatibility issue detected"}
        </span>
      </div>
    </div>
  );
}
