import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/chatStore";
import { useAIChat } from "../../hooks/useAIChat";
import { useConfigStore } from "../../store/configStore";
import { PARTS } from "../../data/products";

const QUICK_ACTIONS = [
  {
    label: "Best for gaming?",
    prompt:
      "What switches should I get for gaming? I want something fast and smooth.",
  },
  {
    label: "Quiet build?",
    prompt: "I need a quiet keyboard for office use. What do you recommend?",
  },
  {
    label: "Max thock?",
    prompt:
      "I want the thockiest, deepest sounding keyboard possible. What should I pick?",
  },
  {
    label: "Check compat",
    prompt: "Can you check if my current build is fully compatible?",
  },
  {
    label: "Explain my build",
    prompt: "Can you explain what my current build will feel and sound like?",
  },
  {
    label: "Show anatomy",
    prompt: "Show me the exploded view and explain how the parts fit together.",
  },
  {
    label: "Show anatomy",
    prompt: "Show me the exploded view and explain how the parts fit together.",
  },
];

function PartAppliedTag({ action }) {
  const allParts = Object.values(PARTS).flat();
  const part = allParts.find((p) => p.id === action.partId);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        background: "rgba(99,102,241,0.15)",
        border: "1px solid rgba(99,102,241,0.3)",
        borderRadius: 20,
        fontSize: 11,
        color: "#a5b4fc",
        marginTop: 6,
      }}
    >
      <span>✓</span>
      <span>Applied: {part?.name || action.partId}</span>
    </div>
  );
}

function Message({ msg, isStreaming }) {
  const isUser = msg.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
      }}
    >
      {!isUser && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
            }}
          >
            M
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>
            Max
          </span>
          {isStreaming && (
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "#6366f1",
                    animation: `bounce 1s infinite ${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <div
        style={{
          maxWidth: "85%",
          padding: "10px 14px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
          background: isUser
            ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
            : msg.isError
              ? "rgba(239,68,68,0.1)"
              : "rgba(255,255,255,0.05)",
          border: isUser
            ? "none"
            : msg.isError
              ? "1px solid rgba(239,68,68,0.3)"
              : "1px solid rgba(255,255,255,0.08)",
          fontSize: 13,
          lineHeight: 1.6,
          color: isUser ? "#ffffff" : msg.isError ? "#f87171" : "#cbd5e1",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {msg.text}
      </div>

      {/* Tool actions */}
      {msg.toolActions?.length > 0 && (
        <div
          style={{
            marginTop: 4,
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            maxWidth: "85%",
          }}
        >
          {msg.toolActions
            .filter((a) => a.type === "part_applied")
            .map((action, i) => (
              <PartAppliedTag key={i} action={action} />
            ))}
          {msg.toolActions.some((a) => a.type === "exploded") && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "rgba(20,184,166,0.15)",
                border: "1px solid rgba(20,184,166,0.3)",
                borderRadius: 20,
                fontSize: 11,
                color: "#2dd4bf",
                marginTop: 6,
              }}
            >
              👁 View updated
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ChatPanel() {
  const { isOpen, setOpen, messages, isLoading, streamingText } =
    useChatStore();
  const { sendMessage } = useAIChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    setInput("");
    await sendMessage(text);
  };

  const handleQuickAction = (prompt) => {
    setInput(prompt);
    sendMessage(prompt);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          boxShadow: "0 0 30px rgba(99,102,241,0.5)",
          zIndex: 100,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        ✨
      </button>
    );
  }

  return (
    <>
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .chat-input::placeholder { color: #475569; }
        .chat-input:focus { outline: none; border-color: rgba(99,102,241,0.5) !important; }
      `}</style>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: 380,
          height: "70vh",
          maxHeight: 620,
          background: "rgba(10,10,20,0.97)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderBottom: "none",
          borderRadius: "16px 0 0 0",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
          boxShadow:
            "0 0 60px rgba(99,102,241,0.15), -10px -10px 40px rgba(0,0,0,0.5)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 16px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            M
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>
              Max
            </div>
            <div style={{ fontSize: 11, color: "#6366f1" }}>
              KeyForge Specialist · Online
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: 18,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
          }}
        >
          {messages.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⌨️</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#e2e8f0",
                  marginBottom: 6,
                }}
              >
                Hey, I'm Max!
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                I'm your keyboard specialist. Ask me anything about your build —
                switches, sound signatures, compatibility, or let me design a
                build for you.
              </div>

              {/* Quick actions */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                }}
              >
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => handleQuickAction(action.prompt)}
                    style={{
                      padding: "6px 12px",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      borderRadius: 20,
                      color: "#a5b4fc",
                      fontSize: 12,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(99,102,241,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <Message key={msg.id || i} msg={msg} />
          ))}

          {/* Streaming message */}
          {isLoading && streamingText && (
            <Message
              msg={{ role: "assistant", text: streamingText }}
              isStreaming
            />
          )}

          {/* Loading dots when no streaming text yet */}
          {isLoading && !streamingText && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                M
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#6366f1",
                      animation: `bounce 1s infinite ${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick actions when messages exist */}
        {messages.length > 0 && (
          <div
            style={{
              padding: "8px 16px",
              display: "flex",
              gap: 6,
              overflowX: "auto",
              flexShrink: 0,
              borderTop: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {QUICK_ACTIONS.slice(0, 3).map((action) => (
              <button
                key={action.label}
                onClick={() => !isLoading && handleQuickAction(action.prompt)}
                disabled={isLoading}
                style={{
                  padding: "4px 10px",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  borderRadius: 20,
                  color: isLoading ? "#374151" : "#818cf8",
                  fontSize: 11,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.15s",
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask Max anything..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "9px 14px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              color: "#e2e8f0",
              fontSize: 13,
              transition: "border-color 0.2s",
            }}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background:
                isLoading || !input.trim()
                  ? "rgba(99,102,241,0.2)"
                  : "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              color: "#fff",
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
