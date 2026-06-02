import { useConfigStore } from "../../store/configStore";

export default function Header() {
  const { exploded, setExploded, resetConfig } = useConfigStore();

  return (
    <header
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        zIndex: 10,
        background:
          "linear-gradient(180deg, rgba(10,10,20,0.8) 0%, transparent 100%)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
          }}
        >
          ⌨
        </div>
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#e2e8f0",
              letterSpacing: "-0.5px",
            }}
          >
            KeyForge
          </div>
          <div
            style={{
              fontSize: 10,
              color: "#6366f1",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Studio
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {/* Exploded view toggle */}
        <button
          onClick={() => setExploded(!exploded)}
          style={{
            padding: "7px 14px",
            background: exploded
              ? "rgba(99,102,241,0.2)"
              : "rgba(255,255,255,0.05)",
            border: exploded
              ? "1px solid rgba(99,102,241,0.5)"
              : "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: exploded ? "#a5b4fc" : "#94a3b8",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          <span>{exploded ? "🔧" : "📦"}</span>
          {exploded ? "Assemble" : "Explode View"}
        </button>

        {/* Reset */}
        <button
          onClick={resetConfig}
          style={{
            padding: "7px 12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            color: "#64748b",
            fontSize: 12,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94a3b8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
        >
          Reset
        </button>
      </div>
    </header>
  );
}
