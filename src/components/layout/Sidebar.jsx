import PartSelector from "../configurator/PartSelector";
import ConfigSummary from "../configurator/ConfigSummary";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 300,
        height: "100%",
        background: "rgba(10,10,20,0.85)",
        backdropFilter: "blur(20px)",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "relative",
        zIndex: 5,
      }}
    >
      {/* Top label */}
      <div
        style={{
          padding: "16px 16px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: "#475569",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          Configure
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#e2e8f0",
            marginTop: 2,
          }}
        >
          Your Build
        </div>
      </div>

      {/* Part selector — takes all remaining height */}
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PartSelector />
      </div>

      {/* Summary always pinned at bottom */}
      {/* <ConfigSummary /> */}
    </aside>
  );
}
