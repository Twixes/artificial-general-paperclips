import type { AgentMessage } from "@/types/game";

interface AgentPanelProps {
  title: string;
  titleColor: string;
  messages: AgentMessage[];
  emptyMessage: string;
}

export function AgentPanel({
  title,
  titleColor,
  messages,
  emptyMessage,
}: AgentPanelProps) {
  return (
    <div>
      <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
        {title}
      </h2>
      <div
        style={{
          border: "1px solid #000",
          padding: "10px",
          height: "500px",
          overflowY: "auto",
          background: "#fff",
        }}
      >
        {messages.length === 0 ? (
          <div style={{ fontStyle: "italic", color: "#666" }}>{emptyMessage}</div>
        ) : (
          <div>
            {messages.map((msg, idx) => (
              <div
                key={`${msg.agent}-${idx}`}
                style={{
                  border: "1px solid #000",
                  padding: "8px",
                  marginBottom: "10px",
                }}
              >
                <div style={{ fontSize: "11px", marginBottom: "5px" }}>
                  <b>{msg.type.toUpperCase()}</b>
                  {msg.type === "reasoning" && !msg.reasoningComplete && (
                    <span> ●</span>
                  )}
                </div>
                <div style={{ whiteSpace: "pre-wrap", fontSize: "12px" }}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
